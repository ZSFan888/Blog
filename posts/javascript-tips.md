---
id: javascript-tips
title: 几个实用的 JavaScript 技巧
excerpt: 整理了几个日常开发中高频使用的 JavaScript 技巧，包括可选链、空值合并、数组去重等。
date: 2026-06-14
updatedAt: 2026-06-14
category: 技术
tags:
  - JavaScript
  - 前端
  - 技巧
coverImage: https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop
---

# 几个实用的 JavaScript 技巧

日常开发中积累的一些高频技巧，持续整理中。

## 1. 可选链操作符 `?.`

再也不用写一堆 `&&` 判断了：

```javascript
// 旧写法
const city = user && user.address && user.address.city;

// 新写法
const city = user?.address?.city;

// 配合方法调用
const len = arr?.length;
const first = arr?.[0];
obj?.method?.();
```

## 2. 空值合并 `??`

只在值为 `null` 或 `undefined` 时使用默认值，不会误判 `0` 和 `''`：

```javascript
// || 的问题：0 和空字符串也会触发
const count = value || 10;  // value=0 时返回 10，不符合预期

// ?? 更精确
const count = value ?? 10;  // 只有 null/undefined 才返回 10
```

## 3. 数组去重

```javascript
// Set 去重（简单类型）
const unique = [...new Set([1, 2, 2, 3, 3, 4])];
// [1, 2, 3, 4]

// 对象数组按字段去重
const uniqueById = arr.filter(
  (item, index, self) => index === self.findIndex(t => t.id === item.id)
);
```

## 4. 对象解构重命名

```javascript
const { name: userName, age: userAge = 18 } = user;
// userName = user.name
// userAge = user.age ?? 18
```

## 5. Promise 并发控制

```javascript
// 全部并发执行，等待所有完成
const [users, posts] = await Promise.all([fetchUsers(), fetchPosts()]);

// 任意一个完成就返回
const result = await Promise.race([fetchFast(), fetchSlow()]);

// 所有结果（含失败）
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.error(r.reason);
});
```

## 6. 用 `structuredClone` 深拷贝

```javascript
// 不再需要 JSON.parse(JSON.stringify(...)) 这种hack
const deep = structuredClone(original);
// 支持 Date、Map、Set、循环引用
```

---

持续更新中，欢迎收藏。
