# Northstar 运营管理平台

前后端分离：Vue 3 管理端独立部署，Java 后端提供 `/api/v1` 接口。默认通过 Vite 把 `/api` 代理到 `http://localhost:8080`。

## 技术栈

- 前端：Vue 3 + TypeScript + Vite + Pinia + Vue Router + Element Plus + axios
- 后端：Spring Boot 4 + Java 17 + MyBatis-Plus + Sa-Token + **MySQL**（默认，账号 `root/root`，库 `northstar`）；本地也可 `--spring.profiles.active=h2`
- 鉴权：Access Token 仅存内存，Refresh Token 存 `sessionStorage`，请求头 `Authorization: Bearer`

## 启动

后端（需 JDK 17）：

```powershell
cd "D:\Study\JavaStudy\NorthStart Operations Management Platform"
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot"
$env:Path = "$env:JAVA_HOME\bin;" + $env:Path
.\mvnw.cmd -DskipTests spring-boot:run
```

前端：

```sh
pnpm install
pnpm dev
```

浏览器访问 `http://localhost:8081`。

演示账号：

| 账号 | 密码 | 说明 |
| --- | --- | --- |
| admin | Admin@123456 | 超级管理员 |
| member | Member@123456 | 普通成员（无系统管理菜单） |
| ops | Ops@123456 | 运营经理 |
| reviewer | Reviewer@123456 | 审核员，首次登录需改密 |

环境变量：

- `.env.example`：变量清单，方便对照，不参与运行
- `.env.development`：`pnpm dev` 使用，默认打开平台实验室
- `.env.production`：`pnpm build` 使用，关闭平台实验室（`VITE_ENABLE_LAB=false`）
- `.env` / `.env.*.local`：本机覆盖，不提交
