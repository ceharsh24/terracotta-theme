#!/usr/bin/env bash
# Terracotta Theme - Shell/Bash Showcase
# Covers: variables, functions, heredocs, redirects, arrays, traps, subshells

set -euo pipefail
IFS=$'\n\t'

# ── Constants ─────────────────────────────────────────────────────

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly SCRIPT_NAME="$(basename "$0")"
readonly VERSION="2.1.0"
readonly LOG_FILE="/var/log/terracotta/build.log"
readonly MAX_RETRIES=3
readonly TIMEOUT=30

# ── Colors ────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ── Arrays ────────────────────────────────────────────────────────

declare -a THEMES=("dark" "dark-dimmed" "light" "light-bright" "high-contrast-cb")
declare -A THEME_COLORS=(
    [dark]="#141414"
    [dark-dimmed]="#1A1A1A"
    [light]="#F8F8F6"
    [light-bright]="#FFFFFF"
    [high-contrast-cb]="#000000"
)

# ── Logging functions ─────────────────────────────────────────────

log_info() {
    local message="$1"
    local timestamp
    timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "${GREEN}[INFO]${NC} ${timestamp} - ${message}" | tee -a "$LOG_FILE"
}

log_error() {
    local message="$1"
    echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') - ${message}" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $(date '+%H:%M:%S') - $1" >&2
}

# ── Error handling & cleanup ──────────────────────────────────────

cleanup() {
    local exit_code=$?
    log_info "Cleaning up (exit code: ${exit_code})..."

    # Remove temp files
    if [[ -d "${TEMP_DIR:-}" ]]; then
        rm -rf "$TEMP_DIR"
    fi

    # Kill background jobs
    if [[ -n "$(jobs -p 2>/dev/null)" ]]; then
        kill "$(jobs -p)" 2>/dev/null || true
    fi

    exit "$exit_code"
}

trap cleanup EXIT ERR INT TERM

# ── Utility functions ─────────────────────────────────────────────

check_dependencies() {
    local -a required_commands=("node" "npm" "jq" "git" "curl")
    local missing=0

    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &>/dev/null; then
            log_error "Required command not found: ${cmd}"
            ((missing++))
        fi
    done

    if ((missing > 0)); then
        log_error "${missing} required dependencies missing"
        return 1
    fi

    log_info "All ${#required_commands[@]} dependencies satisfied"
}

retry_command() {
    local -r max_attempts="${1}"
    local -r delay="${2}"
    shift 2
    local attempt=1

    until "$@"; do
        if ((attempt >= max_attempts)); then
            log_error "Command failed after ${max_attempts} attempts: $*"
            return 1
        fi
        log_warn "Attempt ${attempt}/${max_attempts} failed, retrying in ${delay}s..."
        sleep "$delay"
        ((attempt++))
    done
}

# ── File operations ───────────────────────────────────────────────

validate_json() {
    local file="$1"

    if [[ ! -f "$file" ]]; then
        log_error "File not found: ${file}"
        return 1
    fi

    if ! jq empty "$file" 2>/dev/null; then
        log_error "Invalid JSON: ${file}"
        return 1
    fi

    local token_count
    token_count=$(jq '.tokenColors | length' "$file")
    log_info "Valid JSON: ${file} (${token_count} token rules)"
}

process_theme() {
    local theme_name="$1"
    local theme_file="themes/terracotta-${theme_name}.json"
    local bg_color="${THEME_COLORS[$theme_name]}"

    log_info "Processing theme: ${theme_name} (bg: ${bg_color})"

    # Read and transform with jq
    local semantic_count
    semantic_count=$(jq '.semanticTokenColors | length' "$theme_file")
    local textmate_count
    textmate_count=$(jq '.tokenColors | length' "$theme_file")

    cat <<-EOF
	Theme: ${theme_name}
	  Background:     ${bg_color}
	  Semantic tokens: ${semantic_count}
	  TextMate rules:  ${textmate_count}
	EOF
}

# ── Heredoc examples ──────────────────────────────────────────────

generate_report() {
    local output_file="${1:-report.md}"
    local total_themes=${#THEMES[@]}
    local timestamp
    timestamp=$(date -u '+%Y-%m-%dT%H:%M:%SZ')

    # Heredoc with variable expansion
    cat > "$output_file" <<EOF
# Terracotta Theme Report
Generated: ${timestamp}
Version: ${VERSION}
Total variants: ${total_themes}

## Themes
EOF

    # Heredoc without expansion (quoted delimiter)
    cat >> "$output_file" <<'TEMPLATE'
| Theme | Background | Foreground | Contrast |
|-------|-----------|------------|----------|
TEMPLATE

    # Append theme data
    for theme in "${THEMES[@]}"; do
        echo "| ${theme} | ${THEME_COLORS[$theme]} | - | - |" >> "$output_file"
    done

    log_info "Report generated: ${output_file}"
}

# ── Process substitution & pipes ──────────────────────────────────

check_contrast_ratios() {
    local theme_dir="$1"

    # Find all theme files and process
    while IFS= read -r -d '' file; do
        local name
        name=$(basename "$file" .json)

        # Extract foreground color with jq
        local fg
        fg=$(jq -r '.colors["editor.foreground"] // "unknown"' "$file")
        local bg
        bg=$(jq -r '.colors["editor.background"] // "unknown"' "$file")

        printf "%-25s fg=%-10s bg=%-10s\n" "$name" "$fg" "$bg"
    done < <(find "$theme_dir" -name "*.json" -print0 | sort -z)
}

# ── Arithmetic & conditionals ─────────────────────────────────────

calculate_stats() {
    local -a values=("$@")
    local sum=0
    local count=${#values[@]}

    if ((count == 0)); then
        echo "No values provided"
        return 1
    fi

    for val in "${values[@]}"; do
        sum=$((sum + val))
    done

    local average=$((sum / count))
    local min=${values[0]}
    local max=${values[0]}

    for val in "${values[@]}"; do
        ((val < min)) && min=$val
        ((val > max)) && max=$val
    done

    echo "Count: ${count}, Sum: ${sum}, Avg: ${average}, Min: ${min}, Max: ${max}"
}

# ── Subshell & command substitution ───────────────────────────────

build_all_themes() {
    TEMP_DIR=$(mktemp -d)
    log_info "Build directory: ${TEMP_DIR}"

    local pids=()

    for theme in "${THEMES[@]}"; do
        (
            log_info "Building ${theme} in subshell (PID: $$)..."
            process_theme "$theme" > "${TEMP_DIR}/${theme}.txt" 2>&1
            validate_json "themes/terracotta-${theme}.json"
        ) &
        pids+=($!)
    done

    # Wait for all background jobs
    local failed=0
    for pid in "${pids[@]}"; do
        if ! wait "$pid"; then
            ((failed++))
        fi
    done

    if ((failed > 0)); then
        log_error "${failed}/${#pids[@]} builds failed"
        return 1
    fi

    log_info "All ${#THEMES[@]} themes built successfully"
}

# ── Case statement & pattern matching ─────────────────────────────

parse_args() {
    local action=""
    local verbose=false
    local theme="all"

    while [[ $# -gt 0 ]]; do
        case "$1" in
            -h|--help)
                cat <<-USAGE
				Usage: ${SCRIPT_NAME} [OPTIONS] ACTION

				Actions:
				  build     Build all theme variants
				  validate  Validate JSON files
				  report    Generate contrast report
				  stats     Show theme statistics

				Options:
				  -t, --theme NAME  Process specific theme
				  -v, --verbose     Enable verbose output
				  -h, --help        Show this help
				  --version         Show version
				USAGE
                exit 0
                ;;
            --version)
                echo "${SCRIPT_NAME} v${VERSION}"
                exit 0
                ;;
            -v|--verbose)
                verbose=true
                shift
                ;;
            -t|--theme)
                theme="${2:?Error: --theme requires a value}"
                shift 2
                ;;
            build|validate|report|stats)
                action="$1"
                shift
                ;;
            *)
                log_error "Unknown argument: $1"
                exit 1
                ;;
        esac
    done

    [[ "$verbose" == true ]] && set -x

    case "$action" in
        build)    build_all_themes ;;
        validate)
            for t in "${THEMES[@]}"; do
                validate_json "themes/terracotta-${t}.json"
            done
            ;;
        report)   generate_report ;;
        stats)    calculate_stats 101 101 101 101 101 ;;
        *)
            log_error "No action specified. Use --help for usage."
            exit 1
            ;;
    esac
}

# ── Main ──────────────────────────────────────────────────────────

main() {
    log_info "Starting ${SCRIPT_NAME} v${VERSION}"
    check_dependencies
    parse_args "$@"
    log_info "Done."
}

main "$@"
