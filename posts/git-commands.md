---
id: git-commands
title: Git 常用命令速查表
excerpt: 整理了开发中最常用的 Git 命令，包括分支管理、撤销操作、stash 使用等，建议收藏备用。
date: 2026-06-14
category: 分享
tags:
  - Git
  - 工具
  - 速查
---

# Git 常用命令速查表

## 基础操作

```bash
# 初始化仓库
git init

# 克隆仓库
git clone https://github.com/user/repo.git

# 查看状态
git status

# 添加到暂存区
git add .           # 所有文件
git add file.txt    # 指定文件

# 提交
git commit -m "feat: add new feature"

# 推送
git push origin main
git push -u origin main  # 首次推送并设置上游
```

## 分支管理

```bash
# 查看分支
git branch          # 本地
git branch -r       # 远程
git branch -a       # 全部

# 创建并切换
git checkout -b feature/new-feature
git switch -c feature/new-feature  # 新语法

# 切换分支
git checkout main
git switch main

# 合并分支
git merge feature/new-feature

# 删除分支
git branch -d feature/new-feature      # 本地
git push origin --delete feature/xxx   # 远程
```

## 撤销操作

| 场景 | 命令 |
|---|---|
| 撤销工作区修改 | `git checkout -- file.txt` |
| 撤销暂存区 | `git reset HEAD file.txt` |
| 撤销最后一次提交（保留修改） | `git reset --soft HEAD~1` |
| 撤销最后一次提交（丢弃修改） | `git reset --hard HEAD~1` |
| 生成反向提交 | `git revert HEAD` |

## Stash 临时储藏

```bash
# 储藏当前修改
git stash
git stash save "描述信息"

# 查看 stash 列表
git stash list

# 恢复最近的 stash
git stash pop       # 恢复并删除
git stash apply     # 恢复但保留

# 恢复指定 stash
git stash pop stash@{2}

# 删除 stash
git stash drop stash@{0}
git stash clear     # 清空全部
```

## 查看历史

```bash
# 简洁日志
git log --oneline

# 图形化日志
git log --oneline --graph --all

# 查看某文件历史
git log --follow -p file.txt

# 查看某次提交内容
git show abc1234
```

## 远程操作

```bash
# 查看远程
git remote -v

# 添加远程
git remote add origin https://github.com/user/repo.git

# 拉取（不合并）
git fetch origin

# 拉取并合并
git pull origin main

# 强制推送（谨慎）
git push --force-with-lease origin main
```

---

> 💡 提交信息推荐使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：`feat:` `fix:` `docs:` `chore:` `refactor:`
