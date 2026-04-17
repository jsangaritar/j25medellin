#!/bin/bash
# Sends a native OS notification when Claude needs user input.
# Used as a Notification hook.
# Supports macOS (terminal-notifier / osascript), Linux (notify-send), and WSL (powershell).

INPUT=$(cat 2>/dev/null)

# Only notify for input-waiting events (skip task-complete, progress, etc.)
if command -v jq >/dev/null 2>&1 && [ -n "$INPUT" ]; then
  HOOK_TYPE=$(echo "$INPUT" | jq -r '.type // empty' 2>/dev/null)
  # Skip unless it's a prompt/input event — empty type also skipped
  case "$HOOK_TYPE" in
    permission_prompt|elicitation_dialog|idle_prompt) ;;
    *) exit 0 ;;
  esac
fi

# Extract the notification message
MESSAGE="Claude Code needs your attention"
if command -v jq >/dev/null 2>&1 && [ -n "$INPUT" ]; then
  MSG=$(echo "$INPUT" | jq -r '.message // empty' 2>/dev/null)
  if [ -n "$MSG" ]; then
    MESSAGE="$MSG"
  fi
fi

TITLE="Claude Code"
SUBTITLE="Waiting for input"

# Resolve the icon path relative to this script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ICON_PATH="$SCRIPT_DIR/assets/claude-icon.png"

# Detect the terminal app bundle ID for click-to-activate (macOS)
detect_terminal_bundle_id() {
  case "${TERM_PROGRAM:-}" in
    vscode)         echo "com.microsoft.VSCode" ;;
    Antigravity)    echo "com.google.antigravity" ;;
    iTerm.app)      echo "com.googlecode.iterm2" ;;
    WarpTerminal)   echo "dev.warp.Warp-Stable" ;;
    Apple_Terminal)  echo "com.apple.Terminal" ;;
    tmux)
      local parent="${LC_TERMINAL:-}"
      case "$parent" in
        iTerm2)  echo "com.googlecode.iterm2" ;;
        *)       echo "com.apple.Terminal" ;;
      esac
      ;;
    *)  # Fallback: check if Antigravity is the frontmost app
      local front
      front=$(osascript -e 'tell application "System Events" to get bundle identifier of first process whose frontmost is true' 2>/dev/null)
      echo "${front:-com.apple.Terminal}" ;;
  esac
}

# macOS — prefer terminal-notifier (click-to-activate support)
if command -v terminal-notifier >/dev/null 2>&1; then
  BUNDLE_ID=$(detect_terminal_bundle_id)
  NOTIFIER_ARGS=(
    -title "$TITLE"
    -subtitle "$SUBTITLE"
    -message "$MESSAGE"
    -sound Funk
    -activate "$BUNDLE_ID"
    -group "claude-code"
  )
  # Add Claude icon as inline content image
  if [ -f "$ICON_PATH" ]; then
    NOTIFIER_ARGS+=(-contentImage "$ICON_PATH")
  fi
  # Run in background — terminal-notifier blocks waiting for click interaction
  terminal-notifier "${NOTIFIER_ARGS[@]}" &>/dev/null &
  exit 0
fi

# macOS fallback — osascript (no click-to-activate)
if command -v osascript >/dev/null 2>&1; then
  osascript -e "display notification \"$MESSAGE\" with title \"$TITLE\" subtitle \"$SUBTITLE\" sound name \"Funk\"" 2>/dev/null
  exit 0
fi

# Linux (native)
if command -v notify-send >/dev/null 2>&1; then
  notify-send -u normal -a "$TITLE" "$TITLE — $SUBTITLE" "$MESSAGE" 2>/dev/null
  exit 0
fi

# WSL → Windows toast
if command -v powershell.exe >/dev/null 2>&1; then
  powershell.exe -Command "[System.Reflection.Assembly]::LoadWithPartialName('System.Windows.Forms') | Out-Null; \$n = New-Object System.Windows.Forms.NotifyIcon; \$n.Icon = [System.Drawing.SystemIcons]::Information; \$n.Visible = \$true; \$n.ShowBalloonTip(5000, '$TITLE', '$MESSAGE', 'Info')" 2>/dev/null
  exit 0
fi

# No notification method available — silent exit
exit 0
