---
name: text-check-skill
description: 检查文件中是否包含敏感词。使用 text-check-skill 来扫描文件内容，查找是否存在通过 Sensitivity-lexicon 定义的敏感词汇。适用于内容审核、合规性检查等场景。
---

# Text Check Skill

这个 Skill 用于检查目标文件内容是否包含敏感词。

## 用法

使用 `check.bat` (Windows) 或 `check.sh` (macOS/Linux) 脚本来执行检查。它会自动检测并使用 Python 或 Node.js 环境。

### 脚本位置

`scripts/check.bat` (Windows)
`scripts/check.sh` (macOS/Linux)
`scripts/check_text.py` (Python)
`scripts/check_text.js` (Node.js)

### 参数

- `target_file`: (必须) 需要检查的目标文件路径。
- `vocab_dir`: (可选) 敏感词库目录。默认为 Skill 内置的词库 (`assets/vocabulary`)。

### 示例

```powershell
# Windows
scripts\check.bat --target_file "path/to/file.txt"
```

```bash
# macOS/Linux
chmod +x scripts/check.sh
./scripts/check.sh --target_file "path/to/file.txt"
```

# 指定自定义词库目录

```powershell
# Windows
scripts\check.bat --target_file "path/to/file.txt" --vocab_dir "path/to/custom/vocabulary"
```

```bash
# macOS/Linux
./scripts/check.sh --target_file "path/to/file.txt" --vocab_dir "path/to/custom/vocabulary"
```

### 输出

脚本将输出所有发现的敏感词及其在文件中的行号。如果没有发现敏感词，将输出提示信息。
