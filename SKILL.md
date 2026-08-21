---
name: text-check-skill
description: 检查文件内容的合规风险。包含两项能力：(1) 敏感词扫描，基于 Sensitivity-lexicon 词库检测文件中的敏感词汇；(2) 微信公众号运营规范审查，当用户提到公众号、mp、微信、运营规范、发文、投放、群发等相关词汇时，依据本地保存的《微信公众平台运营规范》逐条审查文件内容是否违规。适用于自媒体发文前的内容审核与合规性检查。
---

# Text Check Skill

面向自媒体创作的内容合规检查，两项能力可单独使用，也可一起跑：

| 能力 | 方式 | 适用 |
| --- | --- | --- |
| 敏感词扫描 | 运行脚本做字面匹配 | 快速排查违禁词 |
| 公众号运营规范审查 | 读规范文件后语义判断 | 发文前的违规风险审查 |

---

## 一、敏感词扫描

使用 `check.bat` (Windows) 或 `check.sh` (macOS/Linux) 执行检查，脚本会自动检测并使用 Python 或 Node.js 环境。

### 脚本位置

- `scripts/check.bat` (Windows)
- `scripts/check.sh` (macOS/Linux)
- `scripts/check_text.py` (Python)
- `scripts/check_text.js` (Node.js)

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

指定自定义词库目录：

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

---

## 二、公众号运营规范审查

### 触发时机

当用户的需求涉及 **公众号 / mp / 微信 / 运营规范 / 发文 / 群发 / 投放 / 推文** 等相关词汇时，除敏感词扫描外，还要依据运营规范审查文件内容。

### 规范文件

`assets/rules/wechat-op-rules.md`

来源 <https://mp.weixin.qq.com/mp/opshowpage?action=newoplaw>，抓取日期见文件 frontmatter 的 `fetched` 字段。

### 审查方法

**不要写脚本做关键词匹配。** 运营规范的违规判定依赖上下文语义，字面匹配只会产生大量误报。正确做法是读规范文件，再逐条对照被检查的文件内容做判断：

1. 读 `assets/rules/wechat-op-rules.md`，重点关注下列与"发文内容"直接相关的条款：

   - **第 4 章 公众号和服务号发送内容规范**（4.1 - 4.25），全章都要过一遍，最常命中的是：
     - `4.1` 侵权、侵犯隐私权及原创争议类内容
     - `4.8` 过度营销类内容
     - `4.9` 不实信息类内容
     - `4.11` 煽动、夸大、误导类内容
     - `4.14` 转载内容（是否标注来源与授权）
     - `4.15` 违反市场监管法律法规或规范性文件的内容（极限词、绝对化用语、医疗保健承诺）
     - `4.18` 宣扬封建迷信类内容
     - `4.20` 第三方商业营销内容违规（广告是否标明"广告"字样）
     - `4.21` 诱骗点击类内容（标题与正文是否一致）
     - `4.22` 网络辱骂内容
     - `4.24` 信息资讯未标注信息来源
     - `4.25` 煽动群体对立内容
   - **第 3 章中与内容创作相关的条款**：
     - `3.3` 诱导行为（诱导关注、分享、点赞）
     - `3.6` 滥用原创声明功能
     - `3.12` 欺诈、网赚、可疑服务及不诚信行为
     - `3.27` 非真人自动化创作行为
     - `3.28` 套路化模板写作行为
   - **第 5.3 节** 微信公众平台信息内容使用（引用平台内容的限制）

2. 读被检查的文件全文，逐段比对规范。标题单独看一遍——标题党、与正文不符、仿冒系统消息是高频违规点。

3. 报告命中项，每一条给出：

   - **条款号与条款名**（如 `4.15 违反市场监管法律法规或规范性文件的内容`）
   - **风险等级**：高（明确违规，发布可能被删文或封号）/ 中（存在争议，建议修改）/ 低（提示性，可斟酌）
   - **原文位置与摘录**：文件路径 + 行号 + 原句
   - **修改建议**：给出可直接替换的改法，而不是只说"建议删除"

4. 没有命中的条款不要罗列。审查结论要说明是否可以发布，以及必须改的项有哪些。

### 更新规范文件

规范会被微信官方修订，`fetched` 距今较久时（或用户要求更新时）重新抓取。用 chrome devtools mcp：

1. `new_page` 打开 <https://mp.weixin.qq.com/mp/opshowpage?action=newoplaw>
2. `evaluate_script` 遍历 `.page-inner` 下的正文容器（跳过 `.top-header`），把 `h1`-`h4` 转成对应层级的 markdown 标题，`p` 转成段落，`•`/`·` 开头的段落转成 `-` 列表项，`——` 开头的段落转成 `**加粗**`，`a` 标签转成 `[文字](链接)`
3. 写回 `assets/rules/wechat-op-rules.md`，保留 frontmatter 的 `source` / `title` / `fetched` 三个字段，`fetched` 更新为当天日期

该页面是静态 HTML，无需登录，普通 HTTP 请求也能拿到完整内容，抓取受阻时可以退回到 `fetch` 加 `User-Agent` 请求头的方式。
