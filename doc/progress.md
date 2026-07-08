# 椤圭洰杩涘睍璁板綍

## 2026-07-08 Figma MCP 官方端点配置

### 已完成
- 已检查项目级 Kilo 配置：`.kilo/kilo.json`。
- 已将 Figma MCP 远程地址从 `http://127.0.0.1:3845/sse` 调整为官方文档常见的 `http://127.0.0.1:3845/mcp`。

### 当前判断
- 该地址是 Figma Desktop 本地 MCP 服务地址，不是具体 Figma 设计文件链接。
- 设计文件链接后续在任务中单独提供，MCP 服务会通过本地 Figma Desktop 暴露能力给 Kilo 使用。

### 下一步
1. 打开 Figma Desktop 并启用 Dev Mode MCP。
2. 重启或重新加载 Kilo MCP 连接。
3. 使用 Figma 链接或当前选中节点验证 MCP 是否可读取设计上下文。

### 验证结果
- 已通过 Kilo 配置校验。
- 尚未验证 Figma Desktop 本地服务连通性。

---

## 2026-06-22

### 宸插畬鎴�

- 鎵弿椤圭洰缁撴瀯锛氬綋鍓嶄粨搴撳彧鏈� `README.md` 涓� `openspec/`锛屽皻鏈垱寤� React 鍓嶇宸ョ▼銆�
- 璇诲彇璐﹀彿浣撶郴璁捐鏂囨。锛氬凡鎻愬彇娉ㄥ唽鐧诲綍銆佸井淇＄粦瀹氥€佸疄鍚嶈璇併€佷紒涓氳璇併€佷紒涓氱┖闂淬€佸瓙璐﹀彿銆佽鑹叉潈闄愩€佺Н鍒嗐€佸崗璁€侀鎺ф棩蹇椼€佸悗鍙板鏍搞€侀〉闈㈡竻鍗曘€佹暟鎹〃鍜岄獙鏀舵爣鍑嗐€�
- 琛ュ厖 OpenSpec 椤圭洰绾х害鏉燂細
  - `openspec/config.yaml`
  - `openspec/project.md`
- 琛ュ厖鍓嶇宸ョ▼鍏ㄥ眬绾︽潫锛氫唬鐮佽鑼冦€佸叏灞€鐘舵€佺鐞嗐€佽姹備簩娆″皝瑁呫€丷eact Query銆乀ailwindCSS + Ant Design UI 甯冨眬鍘熷垯銆�
- 琛ュ厖缁勪欢鍖栧悎鐞嗗寲绾︽潫锛氱粍浠舵媶鍒嗗繀椤绘湇鍔＄湡瀹炲鐢ㄣ€佽亴璐ｈ竟鐣屽拰鍙祴璇曟€э紝绂佹杩囧害灏佽銆佽繃娣卞眰绾у拰澶嶆潅閰嶇疆寮忕粍浠躲€�
- 琛ュ厖 SaaS 鍔ㄦ€佽矾鐢辩害鏉燂細鍚庣杩斿洖鑿滃崟/鏉冮檺鍏冩暟鎹紝鍓嶇浣跨敤闈欐€佽矾鐢辨敞鍐岃〃鏄犲皠缁勪欢锛屽苟瑕嗙洊鐧诲綍銆�403銆�404銆佸埛鏂版仮澶嶅拰鏉冮檺鍙樺寲銆�
- 琛ュ厖澶ф暟鎹睍绀烘€ц兘涓庨〉闈㈢紦瀛樼害鏉燂細闀垮垪琛�/琛ㄦ牸/绱犳潗澧欐寜鏁版嵁绫诲瀷浼樺寲锛岄〉闈㈢紦瀛樼敱璺敱 meta 涓庢潈闄愰厤缃叡鍚屾帶鍒躲€�
- 琛ュ厖鎺ㄨ崘椤圭洰鐩綍缁撴瀯锛氶噰鐢� app 鍩虹璁炬柦銆乫eatures 棰嗗煙妯″潡銆乻hared 閫氱敤鑳藉姏鐨勫垎灞傛柟寮忥紝绂佹鎻愬墠鍒涘缓澶ч噺绌虹洰褰曘€�
- 鍒涘缓 OpenSpec 鍙樻洿锛歚openspec/changes/add-account-system-react-pages/`銆�
- 琛ュ厖 OpenSpec 鏂囦欢锛�
  - `proposal.md`
  - `design.md`
  - `specs/account-system-pages/spec.md`
  - `tasks.md`
- 琛ュ厖 PRD 涓庨」鐩害鏉熸枃妗ｏ細`doc/account-system-prd-supplement.md`銆�

### 褰撳墠鍒ゆ柇

- 绗竴闃舵搴斿厛瀹屾垚璐﹀彿浣撶郴 React 椤甸潰楠ㄦ灦涓庣姸鎬�/API 濂戠害锛屼笉搴旂洿鎺ュ彧鎸� Figma 鍋氶潤鎬侀〉闈€€�
- React 鎶€鏈柟鍚戝凡鍐欏叆绾︽潫锛岄粯璁ゅ缓璁娇鐢� Vite + React + TypeScript锛岄櫎闈炲洟闃熸寚瀹� Next.js 鎴栧叾浠栨鏋躲€�
- Figma MCP 搴斾綔涓鸿瑙夎緭鍏ワ紱OpenSpec/PRD 璐熻矗涓氬姟瑙勫垯銆佹潈闄愬拰楠屾敹杈圭晫銆�
- 椤圭洰绾х害鏉熷簲鏀惧湪 `openspec/config.yaml` 鍜� `openspec/project.md`锛沗openspec/changes/*` 鍙斁鍏蜂綋鍙樻洿鐨勫閲忓唴瀹广€�
- 鎶€鏈爤鍜岀粍浠跺垱寤鸿鑼冨凡杩涘叆鍏ㄥ眬绾︽潫锛涘悗缁柊澧� change 鏃跺簲鑷姩澶嶇敤杩欎簺瑙勮寖銆�
- 鍔ㄦ€佽矾鐢卞睘浜� SaaS 骞冲彴鍩虹鑳藉姏锛屼絾蹇呴』閲囩敤鈥滃悗绔彍鍗曟潈闄� + 鍓嶇闈欐€佺粍浠舵槧灏勨€濈殑瀹夊叏妯″瀷銆�
- 鎬ц兘浼樺寲鍜岄〉闈㈢紦瀛樺睘浜庡叏灞€绾︽潫锛涘叿浣撳垪琛�/琛ㄦ牸/绱犳潗椤电殑瀹炵幇鏂瑰紡搴斿湪瀵瑰簲 change 鐨� design/tasks 涓粏鍖栥€�
- 鐩綍缁撴瀯閲囩敤鎸夐鍩� feature 鍒囧垎锛宻hared 鍙斁绋冲畾澶嶇敤鑳藉姏锛岄伩鍏嶈繃搴﹀垎灞傘€�
- `openspec/project.md` 宸茬粡寮€濮嬪彉闀匡紝鍚庣画鑻ョ户缁ˉ鍏呯粏鍒欙紝搴旀妸璇︾粏宸ョ▼瑙勮寖鎷嗗埌 `doc/`锛宲roject 鍙繚鐣欐憳瑕佸拰閾炬帴銆�

### 涓嬩竴姝�

1. 鐢ㄦ埛鎻愪緵 Figma 閾炬帴鎴栬妭鐐归摼鎺ャ€�
2. 浣跨敤 Figma MCP 鎵弿棣栨壒椤甸潰璁捐銆�
3. 纭 React 鑴氭墜鏋躲€乁I 缁勪欢搴撳拰璺敱鏂规銆�
4. 鎵ц `/opsx:apply` 鎴栫洿鎺ヨ姹傚紑濮嬪疄鐜拌处鍙蜂綋绯婚〉闈€€�

---

## 2026-06-23 鐜鍙橀噺鎺掓煡琛ュ厖

### 宸插畬鎴�
- 鎵弿浠撳簱鏍圭洰褰曚笌鐜鍙橀噺鏂囦欢妯″紡锛屽綋鍓嶉」鐩唴鏈彂鐜颁换浣� `.env`銆乣.env.local`銆乣.env.development`銆乣.env.production` 鏂囦欢銆�
- 纭 `VITE_APP_BASE_API` 鐨勪娇鐢ㄤ綅缃細
  - `src/utils/request.ts`
  - `src/pages/LoginPage.tsx`
  - `src/vite-env.d.ts`
- 纭褰撳墠浠ｇ爜瀵� `VITE_APP_BASE_API` 閲囩敤鈥滃彲閫夊厹搴曗€濈瓥鐣ワ細
  - `request.ts` 涓湭閰嶇疆鏃朵細鍥為€€涓虹┖瀛楃涓层€�
  - `LoginPage.tsx` 涓湭閰嶇疆鏃堕獙璇佺爜浼氳蛋鏈湴 fallback銆�

### 褰撳墠鍒ゆ柇
- 鐜板湪涓嶆槸鈥滄壘涓嶅埌鏌愪釜鐜版垚 env 鏂囦欢鈥濓紝鑰屾槸杩欎釜浠撳簱鐩墠灏辫繕娌℃湁鍒涘缓鐜鍙橀噺鏂囦欢銆�
- 杩欐槸 Vite 椤圭洰锛岀幆澧冨彉閲忔枃浠跺簲璇ユ斁鍦ㄤ粨搴撴牴鐩綍 `F:\AAA_AI_aisperce\AI-Hit-Factory\`銆�
- 濡傛灉浣犺鏈湴寮€鍙戣仈璋冩帴鍙ｏ紝閫氬父浼樺厛鏂板缓 `.env.development` 鎴� `.env.local`锛屽苟琛ヤ笂 `VITE_APP_BASE_API=...`銆�

### 涓嬩竴姝�
1. 鏍规嵁浣犵殑杩愯鍦烘櫙鍐冲畾鏂板缓 `.env.development` 杩樻槸 `.env.local`銆�
2. 鍦ㄦ枃浠朵腑閰嶇疆 `VITE_APP_BASE_API` 鎸囧悜鍚庣缃戝叧鎴� API 鍩虹鍦板潃銆�
3. 閲嶅惎 Vite 寮€鍙戞湇鍔★紝纭 `import.meta.env.VITE_APP_BASE_API` 宸茬敓鏁堛€�
---

## 2026-06-23 鏈湴鍚庣鑱旇皟鐜琛ュ厖

### 宸插畬鎴�
- 宸叉寜褰撳墠 Vite 椤圭洰缁撴瀯锛屽湪浠撳簱鏍圭洰褰曟柊澧炴湰鍦板紑鍙戠幆澧冩枃浠讹細
  - `F:\AAA_AI_aisperce\AI-Hit-Factory\.env.development`
- 宸茶ˉ鍏呯幆澧冨彉閲忥細
  - `VITE_APP_BASE_API=http://127.0.0.1:8080`
- 宸茬‘璁ゅ綋鍓嶄粨搴撲腑娌℃湁鍏朵粬鍚庣绔彛绾﹀畾鎴� dev proxy 閰嶇疆锛屽洜姝ゆ湰娆￠噰鐢ㄦ湰鍦拌仈璋冩渶甯歌鐨勭洿杩炴柟寮忋€�

### 褰撳墠鍒ゆ柇
- 鐜版湁鍓嶇 API 璺緞缁熶竴浣跨敤 `/api/v1/...`锛岄厤涓� `VITE_APP_BASE_API` 鍚庯紝浼氱洿鎺ヨ姹傚埌 `http://127.0.0.1:8080/api/v1/...`銆�
- 杩欑鏂瑰紡鏈€绠€鍗曪紝閫傚悎褰撳墠闃舵鐩存帴鑱旇皟锛涘師鐞嗕笂灏辨槸鎶� axios 鐨� `baseURL` 褰撲綔鈥滅粺涓€缃戝叧鍓嶇紑鈥濓紝绫讳技鍓嶇璇锋眰鎷︽埅鍣ㄩ噷缁熶竴琛ュ煙鍚嶏紝閬垮厤姣忎釜鎺ュ彛鎵嬪啓瀹屾暣鍦板潃銆�
- 濡傛灉浣犵殑鍚庣瀹為檯杩愯绔彛涓嶆槸 `8080`锛屽悗缁彧闇€瑕佹敼杩欎竴琛屽嵆鍙紝涓嶉渶瑕佸姩鎺ュ彛浠ｇ爜銆�

### 涓嬩竴姝�
1. 鍚姩鎴栭噸鍚墠绔� dev server锛岃 Vite 閲嶆柊鍔犺浇 `.env.development`銆�
2. 鍚姩鍚庣鏈嶅姟锛岀‘璁ゅ畠瀹為檯鐩戝惉鍦板潃鏄惁涓� `http://127.0.0.1:8080`銆�
3. 鐢ㄧ櫥褰曢〉鎴栦换涓€鐪熷疄鎺ュ彛楠岃瘉鑱旇皟鏄惁鎴愬姛锛涘鏋滃け璐ワ紝浼樺厛妫€鏌ョ鍙ｃ€佽法鍩熷拰鍚庣缃戝叧鍓嶇紑銆�
---

## 2026-06-23 澶氱幆澧冨彉閲忚ˉ榻�

### 宸插畬鎴�
- 淇濈暀骞惰鑼冨寲寮€鍙戠幆澧冩枃浠讹細
  - `F:\AAA_AI_aisperce\AI-Hit-Factory\.env.development`
  - 褰撳墠鍊硷細`VITE_APP_BASE_API=http://192.168.110.145:3000`
- 鏂板娴嬭瘯鐜鏂囦欢锛�
  - `F:\AAA_AI_aisperce\AI-Hit-Factory\.env.test`
  - 褰撳墠鍊硷細`VITE_APP_BASE_API=http://127.0.0.1:8080`
- 鏂板鐢熶骇鐜鏂囦欢锛�
  - `F:\AAA_AI_aisperce\AI-Hit-Factory\.env.production`
  - 褰撳墠鍊硷細`VITE_APP_BASE_API=/`

### 褰撳墠鍒ゆ柇
- `development` 鐜浣跨敤灞€鍩熺綉鍚庣鍦板潃锛岄€傚悎浣犵幇鍦ㄥ墠绔繛鎺ュ唴缃戞満鍣ㄨ仈璋冦€�
- `test` 鐜淇濈暀鏈満鍦板潃锛岄€傚悎鏈湴娴嬭瘯鎴� CI 鍦烘櫙涓嬭繛鎺ユ湰鏈烘祴璇曟湇鍔°€�
- `production` 鐜浣跨敤 `/` 鑰屼笉鏄啓姝诲煙鍚嶏紝鍘熺悊鏄鍓嶇璇锋眰榛樿璧扳€滃綋鍓嶇珯鐐瑰悓鍩熲€濓細
  - 濡傛灉绾夸笂鏄� `https://your-domain.com`锛岄偅涔� `/api/v1/...` 浼氳嚜鍔ㄨ姹傚埌 `https://your-domain.com/api/v1/...`
  - 杩欐牱鑳介伩鍏嶆妸鐢熶骇鍩熷悕纭紪鐮佽繘鍓嶇鍖呴噷锛屼篃鏇村埄浜� Nginx / 缃戝叧杞彂鍜屽鐜鍙戝竷銆�

### 涓嬩竴姝�
1. 寮€鍙戣仈璋冩椂缁х画浣跨敤 `npm run dev`锛屼細鑷姩璇诲彇 `.env.development`銆�
2. 濡傛灉鍚庣画闇€瑕佷笓闂ㄧ殑棰勫彂鐜锛屽缓璁啀琛ヤ竴涓� `.env.staging`锛屼笉瑕佸鐢� `production`銆�
3. 涓婄嚎鍓嶇‘璁ら儴缃茬綉鍏虫槸鍚︽妸 `/api/` 姝ｇ‘杞彂鍒板悗绔湇鍔°€�
---

## 2026-06-23 鏆傚瓨鍖虹姸鎬佹牳鏌�

### 宸插畬鎴�
- 宸叉墽琛屾殏瀛樺尯妫€鏌ワ細
  - `git diff --cached --stat`
  - `git diff --cached --name-status`
  - `git status --short`
- 宸茬‘璁ゅ綋鍓嶆殏瀛樺尯涓虹┖锛屾殏鏃犱换浣曞凡 `git add` 鐨勫彉鏇淬€�
- 宸茶瘑鍒綋鍓嶄粛鍋滅暀鍦ㄥ伐浣滃尯鐨勬枃浠跺寘鎷細
  - 宸蹭慨鏀癸細`.gitignore`銆乣doc/progress.md`銆乣openspec/changes/connect-dynamic-menu-routes/tasks.md`銆乣package.json`銆乣package-lock.json`銆乣src/app/App.tsx` 绛�
  - 鏈窡韪細`.env.development`銆乣.env.test`銆乣.env.production`銆乣src/app/router/dynamicRoutes.ts` 绛�

### 褰撳墠鍒ゆ柇
- 浣犵幇鍦ㄨ鐨勨€滄殏瀛樺尯鎻愪氦浠ｇ爜璇︾粏鎻忚堪鈥濆湪涓ユ牸鎰忎箟涓婅繕涓嶅瓨鍦紝鍥犱负鏆傚瓨鍖洪噷娌℃湁鍐呭銆�
- 褰撳墠浠撳簱閲屾湁涓嶅皯鈥滃伐浣滃尯鍙樻洿鈥濓紝浣嗗畠浠繕娌℃湁杩涘叆鏆傚瓨鍖猴紝鎵€浠ヤ笉鑳藉綋浣滄湰娆″緟鎻愪氦鍐呭鏉ョ簿纭弿杩般€�

### 涓嬩竴姝�
1. 濡傛灉浣犺鎴戞弿杩扳€滃噯澶囨彁浜ょ殑浠ｇ爜鈥濓紝鍏堟妸鐩爣鏂囦欢 `git add` 鍒版殏瀛樺尯銆�
2. 鎴栬€呮垜涔熷彲浠ョ洿鎺ュ熀浜庡綋鍓嶅伐浣滃尯鍙樻洿锛屽厛缁欎綘涓€浠解€滄湭鏆傚瓨浠ｇ爜鍙樻洿璇存槑鈥濄€�
---

## 2026-06-23 宸ヤ綔鍖哄彉鏇磋鏄庢暣鐞�

### 宸插畬鎴�
- 宸插熀浜庡綋鍓嶅伐浣滃尯鏀瑰姩鏁寸悊鎻愪氦璇存槑绱犳潗锛岃鐩栧姩鎬佽彍鍗曡矾鐢辨帴鍏ャ€丷eact Query 鍒濆鍖栥€佸鐜鍙橀噺琛ラ綈鍜屾祴璇曡ˉ鍏呫€�
- 宸茬‘璁ゆ湰杞鏄庡熀浜庘€滃綋鍓嶅伐浣滃尯鍙樻洿鈥濊€岄潪鏆傚瓨鍖猴紝鍥犱负鏆傚瓨鍖轰粛涓虹┖銆�

### 褰撳墠鍒ゆ柇
- 褰撳墠杩欐壒鏀瑰姩宸茬粡鍏峰涓€鐗堝畬鏁寸殑涓枃鎻愪氦璇存槑鏉′欢锛岄€傚悎鐩存帴鐢ㄤ簬 commit message 鎵╁睍鎻忚堪銆丳R 鎻忚堪鎴栧彉鏇存眹鎶ャ€�

### 涓嬩竴姝�
1. 鑻ヤ綘鎵ц `git add`锛屽彲鍐嶇敓鎴愪竴鐗堜弗鏍煎搴旀殏瀛樺尯鐨勬彁浜よ鏄庛€�
2. 鑻ヤ綘闇€瑕佽嫳鏂囩増鎴� Conventional Commits 椋庢牸锛屾垜鍙互缁х画琛ャ€�
---

## 2026-06-23 鎻愪氦瑙勮寖琛ュ厖

### 宸插畬鎴�
- 宸叉暣鐞嗗綋鍓嶉」鐩€傚悎閲囩敤鐨勮鑼冨寲 Git 鎻愪氦鏍煎紡锛屽噯澶囪緭鍑哄彲鐩存帴澶嶇敤鐨� commit message 妯℃澘涓庢湰娆℃敼鍔ㄧず渚嬨€�

### 褰撳墠鍒ゆ柇
- 褰撳墠杩欐壒鏀瑰姩鏇撮€傚悎浣跨敤 `Conventional Commits` 椋庢牸锛屼究浜庡悗缁仛鏃ュ織褰掔被銆丳R 闃呰鍜岀増鏈彂甯冦€�

### 涓嬩竴姝�
1. 浼樺厛鎸� `type(scope): subject` 缁撴瀯鎻愪氦銆�
2. 鑻ユ敼鍔ㄨ緝澶э紝鍙ˉ鍏� body锛岃鏄庘€滃仛浜嗕粈涔堚€濃€滀负浠€涔堣繖涔堝仛鈥濃€滃奖鍝嶈寖鍥粹€濄€�
---

## 2026-06-23 Git 鎻愪氦澶辫触鎺掓煡

### 宸插畬鎴�
- 宸叉鏌� Git 鐢ㄦ埛閰嶇疆锛宍user.name` 鍜� `user.email` 鍧囧凡瀛樺湪锛屼笉鏄韩浠戒俊鎭己澶卞鑷淬€�
- 宸叉鏌� `.git/hooks`锛屽綋鍓嶅彧鏈� sample 鏂囦欢锛屾病鏈夌湡瀹炲惎鐢ㄧ殑鎻愪氦閽╁瓙闃诲鎻愪氦銆�
- 宸叉墽琛岋細
  - `git commit --dry-run`
  - `git diff --cached --stat`
  - `git status --short`
- 宸茬‘璁� Git 杩斿洖缁撴灉涓猴細
  - `nothing to commit, working tree clean`

### 褰撳墠鍒ゆ柇
- 褰撳墠涓嶆槸鈥済it 鎻愪氦涓嶄笂鈥濓紝鑰屾槸鈥滃綋鍓嶄粨搴撳凡缁忔病鏈夊彲鎻愪氦鐨勫唴瀹光€濄€�
- Git 瑙嗚涓嬪伐浣滃尯鍜屾殏瀛樺尯閮戒负绌猴紝鍥犳鎵ц鎻愪氦鏃朵細鐩存帴鎷掔粷鐢熸垚鏂版彁浜ゃ€�
- 鍚屾椂褰撳墠鍒嗘敮鐘舵€佷负锛歚Your branch is ahead of 'origin/main' by 1 commit.`锛岃鏄庝綘鏈湴宸茬粡鏈変竴涓皻鏈帹閫佺殑鎻愪氦銆�

### 涓嬩竴姝�
1. 濡傛灉浣犱互涓鸿嚜宸辨敼浜嗕唬鐮侊紝鍏堢‘璁ゆ枃浠舵槸鍚︾湡鐨勪繚瀛樺埌浜嗗綋鍓嶄粨搴撶洰褰曘€�
2. 濡傛灉鏀瑰姩宸茬粡琚彁浜や簡锛岄渶瑕佺殑鏄� `git push`锛屼笉鏄啀娆� `git commit`銆�
3. 濡傛灉浣犳兂寮哄埗鍒堕€犱竴涓┖鎻愪氦锛屽彧鑳芥樉寮忔墽琛� `git commit --allow-empty -m "..."`锛屼絾姝ｅ父寮€鍙戜笉寤鸿杩欐牱鍋氥€�
---

## 2026-06-23 鏂囦欢涓婁紶鎺ュ彛鎺ュ叆璋冪爺

### 宸插畬鎴�
- 宸叉壂鎻忓綋鍓嶅墠绔� API 灏佽妯″紡锛�
  - `src/api/customer/text-image-video/index.ts`
  - `src/api/customer/text-image-video/types.ts`
  - `src/api/shared/types.ts`
  - `src/api/shared/utils.ts`
- 宸茬‘璁ら」鐩綋鍓嶇粺涓€浣跨敤 `request.get/post/delete` 椋庢牸灏佽鎺ュ彛锛岃姹傚眰宸叉湁缁熶竴 `baseURL`銆侀壌鏉冨拰缁撴灉瑙ｅ寘鑳藉姏銆�
- 宸叉绱粨搴撳唴涓婁紶鐩稿叧瀹炵幇锛屽綋鍓嶅彧鏈夐〉闈㈠眰 `Upload/Upload.Dragger` 浜や簰鍗犱綅锛屾病鏈夋垚鍨嬬殑鈥滄枃浠朵笂浼� API 灏佽鈥濄€�
- 宸插皾璇曡鍙栦綘鎻愪緵鐨� Swagger 鏂囨。涓� `api-docs`锛�
  - `http://192.168.110.145:8000/doc.html#/绯荤粺绠＄悊/08.AIGC-鏂囦欢涓婁紶/uploadAudio`
  - `http://192.168.110.145:8000/v3/api-docs`
  - `http://192.168.110.145:8000/v2/api-docs`
- 褰撳墠涓婅堪杩滅▼鏂囨。璁块棶鍧囪秴鏃讹紝灏氭湭鎷垮埌 `uploadAudio` 鐨勭簿纭姹傚瓧娈典笌杩斿洖缁撴瀯銆�

### 褰撳墠鍒ゆ柇
- 鐜板湪宸茬粡鍏峰鈥滄寜椤圭洰鐜版湁椋庢牸鎺ュ叆涓婁紶鎺ュ彛鈥濈殑浠ｇ爜涓婁笅鏂囷紝浣嗚繕缂哄皯鏈€鍏抽敭鐨勫悗绔帴鍙ｅ绾︺€�
- 濡傛灉涓嶅厛纭 `uploadAudio` 鐨勮姹傛柟寮忋€佽〃鍗曞瓧娈靛悕鍜岃繑鍥� `data` 缁撴瀯锛屽氨浼氭妸鎺ュ彛鍐欐垚鎷嶈剳琚嬬増鏈紝鍚庣画鑱旇皟鎴愭湰鍙嶈€屾洿楂樸€�

### 涓嬩竴姝�
1. 鍚戠敤鎴风‘璁� `uploadAudio` 鐨勬帴鍙ｅ绾︼紝鑷冲皯鎷垮埌璇锋眰瀛楁鍚嶅拰杩斿洖绀轰緥銆�
2. 鍩轰簬濂戠害缁欏嚭 1-2 绉嶅墠绔皝瑁呮柟妗堝苟鎺ㄨ崘鏈€灏忓疄鐜般€�
3. 鐢ㄦ埛纭鍚庡啀钀藉湴 API 鏂囦欢銆佺被鍨嬪畾涔夊拰蹇呰鐨勫伐鍏峰嚱鏁般€�
---

## 2026-06-23 AIGC 鏂囦欢涓婁紶鎺ュ彛鎺ュ叆

### 宸插畬鎴�
- 宸叉牴鎹敤鎴锋彁渚涚殑 OpenAPI 濂戠害纭 3 涓笂浼犳帴鍙ｏ細
  - `POST /api/aigc/uploads/audio`
  - `POST /api/aigc/uploads/image`
  - `POST /api/aigc/uploads/video`
- 宸茬‘璁や笁鑰呯粺涓€浣跨敤 `file` 浣滀负涓婁紶瀛楁鍚嶏紝缁熶竴杩斿洖 `url`銆乣objectKey`銆乣originalFilename`銆�
- 宸叉柊澧炰笂浼� API 妯″潡锛�
  - `src/api/aigc/uploads/index.ts`
  - `src/api/aigc/uploads/types.ts`
- 宸叉柊澧炰笂浼� API 娴嬭瘯锛�
  - `src/api/aigc/uploads/index.test.ts`
- 宸茶ˉ鍏呭叡浜笂浼犲伐鍏凤細
  - `src/api/shared/utils.ts`
  - 缁熶竴灏佽 `FormData`
  - 缁熶竴鎻愪緵涓婁紶璇锋眰閰嶇疆
- 宸蹭慨姝ｈ姹傚眰瀵� `FormData` 鐨勫吋瀹癸細
  - `src/utils/request.ts`
  - 涓婁紶鏃剁Щ闄ら粯璁� JSON `Content-Type`锛屼氦缁欐祻瑙堝櫒鑷姩琛� multipart boundary
- 宸茶ˉ鍏呰姹傚眰鍥炲綊娴嬭瘯锛�
  - `src/utils/request.test.ts`

### 褰撳墠鍒ゆ柇
- 鐜板湪椤甸潰灞傚凡缁忓彲浠ョ洿鎺ヨ皟鐢細
  - `uploadAudio(file)`
  - `uploadImage(file)`
  - `uploadVideo(file)`
- 杩欐瀹炵幇淇濇寔浜嗗拰鐜版湁 `system/auth`銆乣system/users` 涓€鑷寸殑鈥滅洿鎺ュ鍑哄嚱鏁扳€濋鏍硷紝娌℃湁棰濆寮曞叆鏂扮殑 API 宸ュ巶妯″紡銆�
- 璇锋眰灞傚凡缁忓叿澶囦笂浼犺兘鍔涳紝鍚庣画鍒殑涓婁紶鎺ュ彛涔熷彲浠ョ洿鎺ュ鐢ㄨ繖濂楁ā寮忥紝涓嶉渶瑕侀噸澶嶄慨 `FormData` 鍏煎銆�

### 楠岃瘉缁撴灉
- `npm test -- src/utils/request.test.ts src/api/aigc/uploads/index.test.ts` 閫氳繃
- `npm run typecheck` 閫氳繃

### 涓嬩竴姝�
1. 鍦ㄥ叿浣撻〉闈㈡帴鍏� `Upload` / `Upload.Dragger` 鏃讹紝涓婁紶鎴愬姛鍚庣洿鎺ユ秷璐硅繑鍥炵殑 `url` 鍜� `objectKey`銆�
2. 濡傛灉鍚庣鍚庣画琛ュ厖鏂囦欢澶у皬銆佹牸寮忛敊璇爜绾﹀畾锛屽彲浠ュ啀鎶婇〉闈㈢骇閿欒鎻愮ず缁嗗寲銆�
3. 濡傞渶棰勮鎴栧洖鏄撅紝浼樺厛淇濆瓨 `url` 鐢ㄤ簬灞曠ず锛屼繚瀛� `objectKey` 鐢ㄤ簬涓氬姟渚у悗缁拷韪垨閲嶆煡銆�
---

## 2026-06-23 涓婁紶鎺ュ彛椤甸潰鎺ュ叆

### 宸插畬鎴�
- 宸叉壂鎻忛」鐩唴鐪熷疄闇€瑕佷笂浼犳帴鍙ｇ殑椤甸潰鍏ュ彛锛岀‘璁や紭鍏堟帴鍏ヨ寖鍥翠负锛�
  - `src/pages/ViralRemixPage.tsx`
  - `src/pages/ImageVideoPage.tsx`
  - `src/pages/ProductVideoPage.tsx`
- 宸插湪 `ViralRemixPage.tsx` 鎺ュ叆锛�
  - 鐖嗘婧愯棰戜笂浼� -> `uploadVideo`
  - 鎹㈠晢鍝佹ā寮忓晢鍝佸浘涓婁紶 -> `uploadImage`
- 宸插湪 `ImageVideoPage.tsx` 鎺ュ叆锛�
  - 鍥剧墖涓婁紶 -> `uploadImage`
  - 涓婁紶鎴愬姛鍚庡洖鏄惧凡涓婁紶鏂囦欢鍚�
- 宸插湪 `ProductVideoPage.tsx` 鎺ュ叆锛�
  - 鍟嗗搧鍥句笂浼� -> `uploadImage`
  - 涓婁紶鎴愬姛鍚庡洖鏄惧凡涓婁紶鏂囦欢鍚�
- 宸茶ˉ鍏呴〉闈㈤泦鎴愭祴璇曪細
  - `src/pages/upload-integration.test.tsx`
- 宸茶ˉ鍏呮祴璇曠幆澧� `ResizeObserver` mock锛�
  - `src/test/setup.ts`

### 褰撳墠鍒ゆ柇
- 褰撳墠涓夊涓婁紶鍏ュ彛宸茬粡涓嶆槸闈欐€佸崰浣嶏紝鑰屾槸鑳界湡姝ｈ皟鐢ㄥ悗绔笂浼� API 鐨勮仈璋冨叆鍙ｃ€�
- 杩欐瀹炵幇浠嶇劧淇濇寔鈥滈〉闈㈠彧鍏冲績涓婁紶缁撴灉鈥濈殑杈圭晫锛屼笂浼犳垚鍔熷悗鍏堟秷璐� `originalFilename/url` 鍋氭渶灏忓洖鏄撅紝娌℃湁鎻愬墠鎶婄礌鏉愬簱褰掓。銆佷换鍔″垱寤恒€佺粨鏋滈瑙堢瓑涓氬姟娣疯繘鏉ャ€�
- 杩欐牱鍋氱殑濂藉鏄笂浼犻摼璺凡缁忔墦閫氾紝浣嗕笟鍔″悗缁粛鍙户缁垎姝ユ帴鍏ワ紝涓嶄細涓€娆℃妸椤甸潰鐘舵€佸鏉傚害鎷夌垎銆�

### 楠岃瘉缁撴灉
- `npm test -- src/pages/upload-integration.test.tsx` 閫氳繃
- `npm run typecheck` 閫氳繃

### 涓嬩竴姝�
1. 鎶� `ImageVideoPage` 涓婁紶鍚庣殑鍥剧墖 `url` 鐪熸鎺ュ叆 `createTextImageVideoTask`锛屽畬鎴愨€滀笂浼犲浘鐗� -> 鍒涘缓鍥炬枃瑙嗛浠诲姟鈥濋棴鐜€�
2. 涓� `ViralRemixPage` 鍜� `ProductVideoPage` 澧炲姞涓婁紶澶辫触鎻愮ず涓庢枃浠舵牸寮�/澶у皬鍓嶇棰勬牎楠屻€�
3. 鑻ュ悗缁渶瑕佺礌鏉愬鐢紝鍐嶈€冭檻鎶婁笂浼犳垚鍔熺粨鏋滄帴鍏ョ礌鏉愬簱鎴栦换鍔¤褰曪紝鑰屼笉鏄幇鍦ㄦ彁鍓嶈€﹀悎銆�
---

## 2026-06-23 AIGC 鏂囦欢涓婁紶鎺ュ彛瀹炵幇

### 宸插畬鎴�
- 宸叉牴鎹綘鎻愪緵鐨� OpenAPI 濂戠害纭 3 涓笂浼犳帴鍙ｏ細
  - `POST /api/aigc/uploads/audio`
  - `POST /api/aigc/uploads/image`
  - `POST /api/aigc/uploads/video`
- 宸茬‘璁や笁绫讳笂浼犵粺涓€浣跨敤 `file` 浣滀负琛ㄥ崟瀛楁鍚嶏紝杩斿洖缁熶竴 `UploadRespVO`锛�
  - `url`
  - `objectKey`
  - `originalFilename`
- 宸茶ˉ榻愪笂浼犳帴鍙ｅ疄鐜扮浉鍏虫枃浠讹細
  - `src/api/aigc/uploads/index.ts`
  - `src/api/aigc/uploads/types.ts`
  - `src/api/aigc/uploads/index.test.ts`
- 宸茶ˉ鍏呭叡浜笂浼犺兘鍔涳細
  - `src/api/shared/utils.ts` 澧炲姞 `FormData` 缁勮宸ュ叿
- 宸蹭慨姝ｈ姹傚眰涓婁紶鍏煎锛�
  - `src/utils/request.ts`
  - `src/utils/request.test.ts`
- 宸茶ˉ鍏� API 鑱氬悎瀵煎嚭锛�
  - `src/api/index.ts`

### 褰撳墠鍒ゆ柇
- 褰撳墠鎺ュ彛灞傚凡缁忓叿澶囩洿鎺ョ粰椤甸潰鎺ュ叆鐨勮兘鍔涳紝椤甸潰鍙渶瑕佷紶鍏� `File` 鍗冲彲锛屼笉闇€瑕佸啀鎵嬪啓 `FormData`銆�
- 杩欐鐪熸淇帀鐨勬牴鍥犱笉鏄€滃皯鍐欎簡涓婁紶鏂规硶鈥濓紝鑰屾槸 `request.ts` 榛樿缁� `post` 璇锋眰甯� JSON 澶达紝涓婁紶鍦烘櫙涓嬩細骞叉壈 `multipart/form-data`銆�
- 鐜板湪璇锋眰灞傚凡缁忛拡瀵� `FormData` 鍋氫簡鍏煎锛岄伩鍏嶄笂浼犺姹傞敊璇惤鍒� JSON 鎴� urlencoded 璇箟銆�

### 楠岃瘉缁撴灉
- 瀹氬悜娴嬭瘯閫氳繃锛�
  - `npm test -- src/utils/request.test.ts src/api/aigc/uploads/index.test.ts`
- 绫诲瀷妫€鏌ラ€氳繃锛�
  - `npm run typecheck`

### 涓嬩竴姝�
1. 鍦ㄥ叿浣撻〉闈㈤噷鎺ュ叆 `uploadAudio`銆乣uploadImage`銆乣uploadVideo`銆�
2. 椤甸潰灞傝ˉ鍏呮牸寮忋€佸ぇ灏忓拰涓婁紶澶辫触鎻愮ず锛岄伩鍏嶆妸鍚庣鏍￠獙鍘嬪姏鍏ㄥ帇鍒版帴鍙ｈ繑鍥炪€�
3. 濡傞渶鍥剧墖/闊抽/瑙嗛涓婁紶杩涘害鏉★紝鍙湪鍚庣画缁欎笂浼� API 澧炲姞 `onUploadProgress` 閰嶇疆閫忎紶銆�
---

## 2026-06-22 Figma UI 浠诲姟鎷嗚В琛ュ厖

### 宸插畬鎴�

- 璇诲彇鐢ㄦ埛鎻愪緵鐨� Figma Make 閾炬帴锛歚geZIsRVZyxDNNiSHQMj8pi`銆�
- 浣跨敤 Figma MCP 鑾峰彇鍘熷瀷婧愮爜涓婁笅鏂囥€�
- 宸茶瘑鍒� Figma 鍘熷瀷椤甸潰锛�
  - 搴旂敤澹充笌椤堕儴鏍忥細`App.tsx`
  - 宸︿晶瀵艰埅锛歚Sidebar.tsx`
  - 宸ヤ綔鍙帮細`Dashboard.tsx`
  - 鍟嗗搧瑙嗛鐢熸垚锛歚ProductVideo.tsx`
  - 鍥炬枃鐢熸垚瑙嗛锛歚ImageVideo.tsx`
  - 鐖嗘瑙嗛鏀圭紪 / 杩界垎锛歚ViralRemix.tsx`
  - 鏁板瓧浜虹鐞嗭細`DigitalHumans.tsx`
  - 浠诲姟璁板綍锛歚TaskRecords.tsx`
  - 绱犳潗搴擄細`AssetLibrary.tsx`
- 鏂板涓€鏈� UI 椤甸潰浠诲姟鎷嗚В鏂囨。锛歚doc/phase-one-ui-task-breakdown.md`銆�

### 褰撳墠鍒ゆ柇

- Figma 褰撳墠瑕嗙洊鐨勬槸鍐呭鐢熶骇骞冲彴 UI 鍘熷瀷锛岄噸鐐瑰湪宸ヤ綔鍙般€佽棰戠敓鎴愩€佽拷鐖嗐€佸浘鏂囩敓瑙嗛銆佹暟瀛椾汉銆佷换鍔¤褰曞拰绱犳潗搴撱€�
- 璐﹀彿浣撶郴椤甸潰灏氭湭鍦ㄦ湰娆� Figma Make 鍘熷瀷涓嚭鐜帮紝搴旀寜 PRD/OpenSpec 鍗曠嫭浣滀负楂樺鏉傚害浠诲姟缁嗗寲銆�
- 涓€鏈熶换鍔″缓璁媶涓猴細
  - 浠诲姟 0锛欶igma UI 椤甸潰搴曞骇銆�
  - 浠诲姟 1锛氳处鍙蜂綋绯汇€�
  - 浠诲姟 2锛氬浘鏂囩敓瑙嗛婕旂ず銆�
  - 浠诲姟 3锛氳拷鐖嗘紨绀恒€�
  - 浠诲姟 4锛氭暟瀛椾汉婕旂ず銆�
- 鍥炬枃鐢熻棰戙€佽拷鐖嗐€佹暟瀛椾汉澶嶆潅搴︿腑绛夛紝鍙互浣滀负鐙珛浠诲姟鎺ㄨ繘锛涜处鍙蜂綋绯诲鏉傚害楂橈紝蹇呴』鍐嶆媶瀛愪换鍔°€�

### 涓嬩竴姝�

1. 鐢ㄦ埛纭鏄惁鍏堟墽琛屼换鍔� 0锛欶igma UI 椤甸潰搴曞骇銆�
2. 纭鍓嶇宸ョ▼鏄惁浣跨敤 Vite + React + TypeScript銆�
3. 纭 UI 缁勪欢绛栫暐锛氭部鐢� Figma 鍘熷瀷鐨� shadcn/Radix 椋庢牸锛岃繕鏄寜鏃㈡湁 OpenSpec 绾︽潫浣跨敤 Ant Design + TailwindCSS銆�
4. 纭鍟嗗搧瑙嗛鐢熸垚鏄惁绾冲叆涓€鏈� UI 浜や粯銆�
5. 纭璐﹀彿浣撶郴鏄惁闇€瑕佽ˉ Figma 椤甸潰锛岃繕鏄厛鎸� PRD/OpenSpec 瀹炵幇涓氬姟椤甸潰銆�

---

## 2026-06-22 UI 搴曞骇 OpenSpec 鍒涘缓琛ュ厖

### 宸插畬鎴�

- 纭涓€鏈� UI 宸ョ▼鏂规浣跨敤 Ant Design + TailwindCSS銆�
- 鏇存柊 `doc/phase-one-ui-task-breakdown.md`锛屽浐鍖� Ant Design + TailwindCSS 鏂规锛屽苟璇存槑涓嶉噰鐢� shadcn/Radix 浣滀负涓€鏈熶富鏍堢殑鍘熷洜銆�
- 鍒涘缓鏂扮殑 OpenSpec change锛歚openspec/changes/add-figma-ui-shell-pages/`銆�
- 琛ラ綈 UI 搴曞骇 change artifacts锛�
  - `proposal.md`
  - `design.md`
  - `specs/figma-ui-shell-pages/spec.md`
  - `tasks.md`
- 杩愯 `openspec status --change add-figma-ui-shell-pages`锛岀‘璁� 4/4 artifacts complete銆�

### 褰撳墠鍒ゆ柇

- `add-figma-ui-shell-pages` 宸茬粡鍙互杩涘叆瀹炵幇闃舵銆�
- 璇� change 鍙礋璐� Figma UI 搴曞骇鍜岄鎵归〉闈㈣繕鍘燂紝涓嶅寘鍚湡瀹炶处鍙蜂綋绯汇€佺湡瀹炵Н鍒嗘墸璐广€佺湡瀹炶棰戠敓鎴愬悗绔拰鍗忚绛剧讲銆�
- 璐﹀彿浣撶郴浠嶄繚鐣欎负鐙珛楂樺鏉傚害浠诲姟锛歚add-account-system-react-pages`銆�
- 鍟嗗搧瑙嗛鐢熸垚宸茶绾冲叆 UI 搴曞骇椤甸潰鑼冨洿锛屽洜涓� Figma 宸叉彁渚涘畬鏁撮〉闈紱鍚庣画鐪熷疄鍟嗗搧瑙嗛鐢熸垚涓氬姟浠嶅彲鍗曠嫭缁嗗寲銆�

### 涓嬩竴姝�

1. 鐢ㄦ埛纭鍚庡紑濮嬫墽琛� `add-figma-ui-shell-pages`銆�
2. 瀹炵幇鍓嶅厛璇诲彇璇� change 鐨� `tasks.md` 骞舵寜浠诲姟椤哄簭鎺ㄨ繘銆�
3. 鑻ュ畨瑁呬緷璧栭渶瑕佽仈缃戞垨鍐欏叆鍙楅檺鐩綍锛屾寜鏉冮檺瑙勫垯璇锋眰鐢ㄦ埛鎵瑰噯銆�
4. 姣忓畬鎴愪竴涓皬闃舵鍚庣户缁洿鏂� `doc/progress.md` 骞朵腑鏂囨眹鎶ャ€�

---

## 2026-06-22 绐楀彛鍏煎鎬цˉ鍏�

### 宸插畬鎴�

- 鏍规嵁鐢ㄦ埛瑕佹眰锛屼负 UI 搴曞骇浠诲姟琛ュ厖绐楀彛鍏煎鎬ц姹傘€�
- 鏇存柊 `doc/phase-one-ui-task-breakdown.md`锛屾柊澧炩€滅獥鍙ｅ吋瀹规€ц姹傗€濄€�
- 鏇存柊 `openspec/changes/add-figma-ui-shell-pages/design.md`锛岃ˉ鍏� PC 浼樺厛銆佺揣鍑戞闈€€佺獎灞忓厹搴曘€佽〃鏍兼í鍚戞粴鍔ㄣ€佸脊绐楁渶澶ч珮搴︾瓑璁捐鍐崇瓥銆�
- 鏇存柊 `openspec/changes/add-figma-ui-shell-pages/specs/figma-ui-shell-pages/spec.md`锛屾柊澧� Browser window compatibility 楠屾敹瑕佹眰銆�
- 鏇存柊 `openspec/changes/add-figma-ui-shell-pages/tasks.md`锛屾柊澧炵獥鍙ｇ煩闃甸獙璇佷换鍔°€�

### 褰撳墠鍒ゆ柇

- 涓€鏈� UI 浠嶄互 PC SaaS 宸ヤ綔鍙颁负涓伙紝涓嶆壙璇哄畬鏁寸Щ鍔ㄧ/灏忕▼搴忓悓绛変綋楠屻€�
- 蹇呴』瑕嗙洊甯歌妗岄潰绐楀彛锛歚1280x720`銆乣1366x768`銆乣1440x900`銆乣1536x864`銆乣1920x1080`銆�
- `1024px - 1279px` 浣滀负绱у噾妗岄潰澶勭悊锛涘皬浜� `1024px` 鍋氬畨鍏ㄥ厹搴曪紝纭繚涓嶇櫧灞忋€佷笉閬尅銆佷笉鍑虹幇涓嶅彲鍏抽棴寮圭獥銆�

### 涓嬩竴姝�

1. 瀹炵幇闃舵鎸夌獥鍙ｇ煩闃靛仛娴忚鍣ㄦ鏌ャ€�
2. 瀵逛换鍔¤褰曘€佺礌鏉愬簱銆佸脊绐椼€佹楠ら〉閲嶇偣妫€鏌ユí鍚戞孩鍑恒€佹寜閽伄鎸″拰浣庨珮搴︽粴鍔ㄩ棶棰樸€�

---

## 2026-06-22 UI 搴曞骇瀹炵幇闃舵杩涘睍

### 宸插畬鎴�

- 寮€濮嬫墽琛� OpenSpec change锛歚add-figma-ui-shell-pages`銆�
- 鍒涘缓 Vite + React + TypeScript 宸ョ▼楠ㄦ灦锛�
  - `package.json`
  - `index.html`
  - `vite.config.ts`
  - `tsconfig.json`
  - `tsconfig.app.json`
  - `tsconfig.node.json`
  - `src/app/main.tsx`
  - `src/app/App.tsx`
  - `src/app/styles.css`
- 寤虹珛搴旂敤鐩綍涓庡熀纭€杈圭晫锛�
  - `src/app/router`
  - `src/app/layouts`
  - `src/pages`
  - `src/features/workspace`
  - `src/shared/components`
  - `src/test`
- 寤虹珛闈欐€佽矾鐢辨敞鍐岃〃涓庤矾鐢卞畧鍗鐣欙細
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/routeGuards.ts`
- 寤虹珛棣栨壒 Mock 绫诲瀷涓� Mock 鏁版嵁杩囨护锛�
  - `src/features/workspace/types.ts`
  - `src/features/workspace/status.ts`
  - `src/features/workspace/mockData.ts`
- 寤虹珛鍩虹娴嬭瘯鏂囦欢锛�
  - `src/app/router/routeRegistry.test.ts`
  - `src/app/router/routeGuards.test.ts`
  - `src/features/workspace/mockData.test.ts`
- 瀹炵幇 Ant Design + TailwindCSS 搴旂敤澹筹細
  - 鏆楄壊涓婚 token
  - 渚ц竟鏍�
  - 椤堕儴鏍�
  - 鍐呭婊氬姩鍖哄煙
  - 渚ц竟鏍忔姌鍙�
  - 绐楀彛鍏煎鍩虹甯冨眬
- 瀹炵幇棣栨壒椤甸潰锛�
  - 宸ヤ綔鍙�
  - 鍟嗗搧瑙嗛鐢熸垚
  - 鍥炬枃鐢熸垚瑙嗛
  - 鐖嗘瑙嗛鏀圭紪 / 杩界垎
  - 鏁板瓧浜虹鐞�
  - 浠诲姟璁板綍
  - 绱犳潗搴�
  - 403 / 404 棰勭暀椤�
- 鏇存柊 `openspec/changes/add-figma-ui-shell-pages/tasks.md`锛屾爣璁板凡瀹屾垚鐨勫伐绋嬮鏋躲€佷富棰樿矾鐢便€丮ock 杈圭晫銆佸叕鍏遍〉闈㈠拰婕旂ず椤甸潰浠诲姟銆�

### 褰撳墠闃诲

- `npm install` 闇€瑕佽仈缃戝畨瑁呬緷璧栵紝浣嗗崌绾ф潈闄愯姹傝瀹℃壒鏈嶅姟鎷掔粷锛岃繑鍥� `503 Service Unavailable`銆�
- 鍥犱緷璧栨湭瀹夎锛屼互涓嬮獙璇佸懡浠ゅ綋鍓嶆棤娉曢€氳繃锛�
  - `npm run typecheck`锛歚tsc` 鏈畨瑁呫€�
  - `npm test`锛歚vitest` 鏈畨瑁呫€�
  - `npm run build`锛歚tsc` / `vite` 鏈畨瑁呫€�

### 褰撳墠鍒ゆ柇

- 浠ｇ爜涓讳綋宸茬粡鎸� UI 搴曞骇浠诲姟钀藉湴锛屼絾杩樹笉鑳藉０鏄庢瀯寤洪€氳繃鎴栨祴璇曢€氳繃銆�
- 涓嬩竴姝ュ繀椤诲厛瀹屾垚渚濊禆瀹夎锛屾墠鑳藉仛 TypeScript銆乂itest銆乂ite build 鍜屾祻瑙堝櫒绐楀彛鐭╅樀楠岃瘉銆�
- 褰撳墠瀹炵幇娌℃湁鎺ュ叆鐪熷疄鍚庣銆佽处鍙蜂綋绯汇€佺Н鍒嗘墸璐规垨鐪熷疄瑙嗛鐢熸垚锛屼粛鏄� UI + Mock 婕旂ず闂幆銆�

### 涓嬩竴姝�

1. 绛夊緟鐢ㄦ埛鏄庣‘鎵瑰噯鎴栧鎵规湇鍔℃仮澶嶅悗锛屾墽琛� `npm install`銆�
2. 瀹夎鎴愬姛鍚庤繍琛岋細
   - `npm run typecheck`
   - `npm test`
   - `npm run build`
3. 鍚姩鏈湴寮€鍙戞湇鍔″櫒锛屾墽琛屾祻瑙堝櫒绐楀彛鐭╅樀妫€鏌ャ€�
4. 淇楠岃瘉涓彂鐜扮殑绫诲瀷銆佹瀯寤烘垨甯冨眬闂銆�

### 2026-06-22 渚濊禆瀹夎鍐嶆灏濊瘯

- 鐢ㄦ埛宸叉槑纭厑璁告湰娆′换鍔℃墽琛屼緷璧栧畨瑁呭拰楠岃瘉鍛戒护銆�
- 鍐嶆鎵ц `npm install` 鏃讹紝鏉冮檺瀹℃壒鏈嶅姟浠嶈繑鍥� `503 Service Unavailable`锛屽懡浠ゆ湭鑳界湡姝ｈ繘鍏� npm 瀹夎闃舵銆�
- 褰撳墠涓嶈兘缁曡繃瀹℃壒閾捐矾瀹夎渚濊禆锛屽洜姝� TypeScript銆乂itest銆乂ite build 鍜屾祻瑙堝櫒楠岃瘉浠嶆殏鏃堕樆濉炪€�

---

## 2026-06-22 npm EBUSY 瀹夎闃诲鎺掓煡

### 宸插畬鎴�

- 宸茶鍙� npm 澶辫触鏃ュ織锛岀‘璁ら敊璇彂鐢熷湪 npm `reify` 闃舵锛歯pm 姝ｅ湪鎶婃棫渚濊禆鐩綍閲嶅懡鍚嶄负涓存椂閫€浼戠洰褰曟椂琚� Windows 鏂囦欢閿侀樆濉炪€�
- 绗竴娆￠攣瀹氱偣涓� `node_modules/@ant-design/icons-svg/es/asn/AndroidFilled.js`锛岄噸鏂版墽琛� `npm install` 鍚庨攣瀹氱偣鍙樺寲涓� `node_modules/@rc-component/pagination`锛岃鏄庝笉鏄崟涓枃浠舵崯鍧忥紝鑰屾槸褰撳墠 `node_modules` 澶勪簬鍗婂畨瑁�/琚崰鐢ㄧ姸鎬併€�
- 宸叉鏌ュ懡浠よ涓笌褰撳墠椤圭洰璺緞鐩稿叧鐨� Node/Vite/npm 杩涚▼锛屾湭鍙戠幇鏄庣‘鎸囧悜 `F:\AAA_AI_aisperce\AI-Hit-Factory` 鐨勮繍琛岃繘绋嬨€�
- 宸叉墽琛� `npm install --package-lock-only --no-audit --no-fund` 骞舵垚鍔熺敓鎴� `package-lock.json`锛岃鏄庝緷璧栬В鏋愬拰缃戠粶閾捐矾鍙敤銆�
- 宸叉墽琛� `npm ls --depth=0`锛岀粨鏋滄樉绀烘牴渚濊禆浠嶄负 `UNMET DEPENDENCY`锛岃鏄庡疄浣撲緷璧栧皻鏈畨瑁呮垚鍔燂紝鐜版湁 `node_modules` 涓嶅彲鐢ㄤ簬绫诲瀷妫€鏌ャ€佹祴璇曟垨鏋勫缓銆�

### 褰撳墠鍒ゆ柇

- 鏍瑰洜闆嗕腑鍦� Windows 瀵规棫 `node_modules` 鐨勬枃浠�/鐩綍閿侊紝鑰屼笉鏄緷璧栫増鏈啿绐佹垨 npm 缃戠粶澶辫触銆�
- 涓嬩竴姝ラ噰鐢ㄤ笉鍒犻櫎鏂囦欢鐨勬柟寮忓鐞嗭細灏嗗綋鍓嶅崐瀹夎鐨� `node_modules` 閲嶅懡鍚嶄负澶囦唤鐩綍锛屽啀鎵ц涓€娆″共鍑€瀹夎銆�

---

## 2026-06-22 渚濊禆鍒犻櫎閲嶈涓庤嚜鍔ㄥ寲楠岃瘉

### 宸插畬鎴�

- 鏍规嵁鐢ㄦ埛鏄庣‘鎺堟潈锛屽垹闄ゅ綋鍓嶉」鐩牴鐩綍涓嬫崯鍧忕殑 `node_modules`锛屽苟娓呯悊鏈鍗婃惉杩佷骇鐢熺殑 `node_modules.ebusy-backup-*` 娈嬬暀鐩綍銆�
- 閲嶆柊鎵ц `npm install` 鎴愬姛锛屽畨瑁呯粨鏋滀负 `added 268 packages`锛屽悗缁ˉ鍏� `jsdom` 鍚庝緷璧栨€婚噺鎭㈠姝ｅ父銆�
- 鏂板娴嬭瘯鐜渚濊禆 `jsdom`锛岀敤浜� Vitest 鐨� `jsdom` environment銆�
- 淇 `vite.config.ts` 鐨勭被鍨嬪叆鍙ｏ細灏� `defineConfig` 浠� `vitest/config` 瀵煎叆锛屼娇 TypeScript 姝ｇ‘璁よ瘑 `test` 閰嶇疆瀛楁銆�
- 鏇存柊 `.gitignore`锛屽拷鐣� `node_modules`銆乣dist` 鍜� `*.tsbuildinfo`銆�
- 宸插畬鎴愬苟閫氳繃浠ヤ笅楠岃瘉锛�
  - `npm ls --depth=0`
  - `npm run typecheck`
  - `npm run lint`
  - `npm test`锛�3 涓祴璇曟枃浠躲€�8 涓祴璇曢€氳繃
  - `npm run build`
- 宸叉洿鏂� `openspec/changes/add-figma-ui-shell-pages/tasks.md`锛屽嬀閫変緷璧栧畨瑁呫€佺被鍨嬫鏌ャ€乴int 鍜岀敓浜ф瀯寤轰换鍔°€�

### 褰撳墠鍒ゆ柇

- 渚濊禆瀹夎闃诲宸茶В闄わ紝椤圭洰鐜板湪鍙互杩涘叆娴忚鍣ㄨ繍琛屼笌绐楀彛鍏煎鎬ч獙璇侀樁娈点€�
- `npm run build` 鏈� Vite chunk size warning锛屽師鍥犳槸棣栨湡椤甸潰涓� Ant Design 渚濊禆琚墦杩涘悓涓€涓叆鍙ｅ寘锛涘綋鍓嶄笉褰卞搷杩愯锛屽悗缁彲閫氳繃璺敱鎳掑姞杞藉拰 manual chunks 浼樺寲銆�
- `npm audit` 鎻愮ず 1 涓� low severity vulnerability锛屽綋鍓嶄笉闃诲 UI 楠屾敹锛涘悗缁彲鍗曠嫭鎵ц `npm audit` 鍒ゆ柇鏄惁闇€瑕佸崌绾с€�

### 涓嬩竴姝�

1. 鍚姩鏈湴寮€鍙戞湇鍔″苟鎵撳紑椤甸潰銆�
2. 鎸夌獥鍙ｇ煩闃垫鏌� `1280x720`銆乣1366x768`銆乣1440x900`銆乣1536x864`銆乣1920x1080`銆�
3. 琛ュ厖妫€鏌ョ揣鍑戞闈� `1024px - 1279px` 鍜岀獎灞忓厹搴� `<1024px`銆�
4. 瀹屾垚娴忚鍣ㄩ獙璇佸悗缁х画鏇存柊浠诲姟娓呭崟涓庤繘灞曟枃妗ｃ€�

---

## 2026-06-22 娴忚鍣ㄨ矾鐢变笌绐楀彛鍏煎鎬ч獙璇�

### 宸插畬鎴�

- 灏嗗簲鐢ㄤ粠鏈湴 state 鍒囬〉鏀逛负 `BrowserRouter + Routes`锛岀洿鎺ヨ闂� `/product-video`銆乣/image-video`銆乣/viral-remix`銆乣/digital-humans`銆乣/tasks`銆乣/assets` 鍧囧彲鏄剧ず瀵瑰簲椤甸潰銆�
- 淇濈暀鐜版湁渚ц竟鏍忎氦浜掞紝鐐瑰嚮瀵艰埅鏃堕€氳繃璺敱璺宠浆锛屽悗缁彲鎵挎帴鍚庣鍔ㄦ€佽彍鍗曞拰鏉冮檺鏄犲皠銆�
- 淇 Ant Design 6 鍏煎鎬ц鍛婏細`Alert` 浣跨敤 `title` 鏇夸唬宸插純鐢ㄧ殑 `message`銆�
- 娴忚鍣ㄩ獙璇佺粨鏋滐細
  - 鎵€鏈夐鎵归〉闈㈢洿杈� URL 鍧囨樉绀哄搴旈〉闈㈠唴瀹广€�
  - 鏂版爣绛鹃〉鎺у埗鍙伴敊璇负 0銆�
  - `1280x720`銆乣1366x768`銆乣1440x900`銆乣1536x864`銆乣1920x1080` 绐楀彛鐭╅樀鏃犲叏灞€妯悜婧㈠嚭銆�
  - `1024x720` 绱у噾妗岄潰涓� `900x720` 绐勫睆鍏滃簳鏃犵櫧灞忋€佹棤鍏ㄥ眬妯悜婧㈠嚭銆�
  - 鏁板瓧浜哄脊绐楀湪 `1280x720` 涓嬪彲鎵撳紑锛屽叧闂寜閽彲瑙侊紝寮圭獥鍖哄煙鏃犳í鍚戞孩鍑恒€�
- 鑷姩鍖栭獙璇佸啀娆￠€氳繃锛�
  - `npm run typecheck`
  - `npm test`锛�3 涓祴璇曟枃浠躲€�8 涓祴璇曢€氳繃
  - `npm run build`
- 宸叉墽琛� `openspec status --change add-figma-ui-shell-pages`锛岀粨鏋滀负 4/4 artifacts complete銆�
- 宸茬‘璁� `openspec/changes/add-figma-ui-shell-pages/tasks.md` 鏃犳湭鍕鹃€変换鍔￠」銆�

### 褰撳墠鍒ゆ柇

- `add-figma-ui-shell-pages` 鐨� UI 搴曞骇銆侀鎵归〉闈€€佽矾鐢辩洿杈俱€佷緷璧栧畨瑁呭拰鍩虹绐楀彛鍏煎鎬у凡杈惧埌鏈樁娈甸獙鏀舵爣鍑嗐€�
- 鏋勫缓浠嶆湁 Vite chunk size warning锛屽睘浜庨鏈熸湭鍋氳矾鐢辩骇鎳掑姞杞藉鑷寸殑鍖呬綋鎻愮ず锛屼笉褰卞搷鏈湴杩愯鍜屽綋鍓� UI 楠屾敹銆�
- 褰撳墠椤甸潰浠嶄负 Mock 婕旂ず闂幆锛屾湭鎺ュ叆鐪熷疄璐﹀彿浣撶郴銆佺Н鍒嗘墸璐广€佽棰戠敓鎴愬悗绔垨绱犳潗涓婁紶鍚庣銆�

### 涓嬩竴姝�

1. 鍚庣画鍙紑濮嬩竴鏈熶换鍔� 1锛氳处鍙蜂綋绯伙紝寤鸿鎷嗘垚鐧诲綍娉ㄥ唽銆佸疄鍚嶈璇�/浼佷笟璁よ瘉銆佷紒涓氱┖闂�/瀛愯处鍙锋潈闄愩€佺Н鍒�/鍗忚/椋庢帶瀹¤鍑犱釜瀛愪换鍔°€�
2. 鍚庣画婕旂ず浠诲姟 2-4 鍙互鍒嗗埆鍩轰簬褰撳墠 UI 椤甸潰缁х画鎺� mock 娴佺▼銆丄PI 濂戠害鍜岀湡瀹炰氦浜掋€�
3. 鏋勫缓鍖呬綋浼樺寲鍙綔涓哄悗缁妧鏈€轰换鍔★紝鐢ㄨ矾鐢辨噿鍔犺浇鎷嗗垎 Ant Design 鐩稿叧 chunk銆�

---

## 2026-06-22 璺敱鎳掑姞杞戒笌鏋勫缓鎷嗗寘浼樺寲

### 宸插畬鎴�

- 灏� `routeRegistry` 鐨勯〉闈㈢粍浠舵敼涓� `React.lazy` 鍔ㄦ€佸鍏ワ紝璺敱椤甸潰浼氱嫭绔嬬敓鎴� chunk銆�
- 鍦� `App.tsx` 涓鍔� `Suspense` 璺敱鍔犺浇鍏滃簳锛岄伩鍏嶉〉闈㈠垏鎹㈡湡闂村嚭鐜扮┖鐧姐€�
- 鍦� `vite.config.ts` 涓鍔� `manualChunks`锛�
  - `react-vendor`锛歊eact銆丷eact DOM銆丷eact Router銆�
  - `antd-vendor`锛欰nt Design銆丄nt Design icons銆乺c-component 鐩稿叧渚濊禆銆�
  - `icon-vendor`锛歭ucide-react銆�
  - `vendor`锛氬叾浠栫涓夋柟渚濊禆銆�
- 澧炲姞 `LazyImage` 缁勪欢锛岀粺涓€鍥剧墖缂╃暐鍥剧殑 `loading="lazy"` 涓� `decoding="async"`銆�
- 绱犳潗搴撳浘鐗囩被绱犳潗澧炲姞 mock 缂╃暐鍥撅紝骞朵娇鐢� `LazyImage` 娓叉煋锛涢潪鍥剧墖绱犳潗浠嶄娇鐢ㄥ浘鏍囧崰浣嶃€�
- 澧炲姞娴嬭瘯瑕嗙洊锛�
  - 璺敱娉ㄥ唽琛ㄥ繀椤讳娇鐢� lazy 椤甸潰缁勪欢銆�
  - `LazyImage` 蹇呴』杈撳嚭娴忚鍣ㄧ骇鎳掑姞杞藉睘鎬с€�

### 褰撳墠鍒ゆ柇

- 棣栭〉鍏ュ彛 chunk 宸叉槑鏄剧缉灏忥紝椤甸潰鍐呭琚媶涓� `DashboardPage`銆乣ProductVideoPage`銆乣ImageVideoPage` 绛夌嫭绔� chunk銆�
- Ant Design 浠嶆槸鏈€澶� vendor chunk锛岃繖鏄粍浠跺簱浣撻噺瀵艰嚧锛屽凡閫氳繃 `manualChunks` 鐙珛闅旂锛屽悗缁彲缁х画鍋氱粍浠剁骇鎸夐渶绛栫暐鎴栨浛鎹㈤噸鍨嬬粍浠躲€�

### 涓嬩竴姝�

1. 鑻ョ户缁紭鍖栭灞忥紝鍙繘涓€姝ユ妸閮ㄥ垎 Ant Design 閲嶅瀷缁勪欢鎸夐〉闈㈣竟鐣岄殧绂汇€�
2. 鍚庣画鎺ョ湡瀹炵礌鏉愬簱鏃讹紝`thumbnailUrl` 鍙互鏇挎崲鎴愬悗绔�/CDN 杩斿洖鍦板潃锛岀户缁部鐢� `LazyImage`銆�

---

## 2026-06-23 鎺ュ彛灞傚皝瑁呬笌妯″潡鍖� API

### 宸插畬鎴�
- 鏍规嵁绯荤粺绠＄悊 Swagger 鏂囨。璇嗗埆鎺ュ彛鍒嗙粍锛屽厛瀹屾垚鎺ュ彛灞傚疄鐜帮紝涓嶆敼鍔ㄩ〉闈笟鍔￠€昏緫銆�
- 鏂板 axios 璇锋眰灏佽锛歚src/utils/request.ts`锛屽寘鍚熀纭€ `baseURL`銆佽秴鏃躲€佹暟缁勫弬鏁板簭鍒楀寲銆丅earer Token 娉ㄥ叆銆乣no-auth` 璺宠繃閴存潈銆佺粺涓€ Result 瑙ｅ寘銆佷簩杩涘埗涓嬭浇鐩磋繑銆佺櫥褰曡繃鏈熶簨浠堕鐣欍€�
- 鏂板璁よ瘉瀛樺偍宸ュ叿锛歚src/utils/auth.ts`锛岄泦涓鐞� access token銆乺efresh token 鍜岀櫥褰曡繃鏈熸竻鐞嗐€�
- 鎸夋ā鍧楁媶鍒� API 鏂囦欢澶癸細`system/auth`銆乣system/users`銆乣system/roles`銆乣system/menus`銆乣system/depts`銆乣system/dicts`銆乣system/configs`銆乣system/notices`銆乣system/logs`銆乣customer/text-image-video`銆�
- 鎻愬彇鍏叡绫诲瀷涓庡叕鍏辨柟娉曪細`src/api/shared/types.ts`銆乣src/api/shared/utils.ts`锛岀粺涓€鍒嗛〉绫诲瀷銆侀€夐」绫诲瀷銆両D 鎵归噺搴忓垪鍖栥€佸叕寮€鎺ュ彛鏍囪鍜屼笅杞介厤缃€�
- 涓鸿姹傚皝瑁呰ˉ鍏� TDD 娴嬭瘯锛歚src/utils/request.test.ts`锛岃鐩� token 娉ㄥ叆銆乣no-auth` 绉婚櫎銆佷笟鍔℃垚鍔熻В鍖呫€佷簩杩涘埗鍝嶅簲鐩磋繑鍜屼笟鍔″け璐ユ彁绀恒€�
- 鏍规嵁瑕佹眰缁欏叧閿帴鍙ｅ眰鍐呭琛ュ厖涓枃娉ㄩ噴锛岄噸鐐硅В閲婂叕鍏辨柟娉曘€佽璇佹帴鍙ｅ拰璇锋眰鎷︽埅鍣ㄧ殑璁捐鎰忓浘銆�
- 鏂板渚濊禆锛歚axios`銆乣qs`銆乣@types/qs`銆�

### 褰撳墠鍒ゆ柇
- 鎺ュ彛灞傜幇鍦ㄥ凡缁忓叿澶囨帴鍏ョ湡瀹炲悗绔殑鍩虹鑳藉姏锛涢〉闈㈠悗缁彧闇€瑕佷粠瀵瑰簲妯″潡 import API 鍑芥暟锛屼笉闇€瑕佺洿鎺ュ叧蹇� axios 缁嗚妭銆�
- Token 鑷姩鍒锋柊褰撳墠鍙鐣欎簡杩囨湡浜嬩欢鍜屼竴娆￠噸璇曚繚鎶わ紝鐪熸 refresh-token 涓茶仈闇€瑕佺瓑鐧诲綍鐘舵€佹ā鍧楄惤鍦板悗鍐嶈ˉ锛岄伩鍏嶇幇鍦ㄨ繃搴﹁璁°€�
- Swagger 涓枃鎻忚堪鍦ㄧ粓绔腑瀛樺湪缂栫爜鏄剧ず闂锛屼絾鎺ュ彛璺緞銆乷peration 鍜� schema 瀛楁鍙互姝ｅ父璇诲彇锛屽綋鍓嶅疄鐜颁互璺緞鍜屽瓧娈靛悕涓哄噯銆�

### 楠岃瘉缁撴灉
- `npm run typecheck` 閫氳繃銆�
- `npm test` 閫氳繃锛�5 涓祴璇曟枃浠躲€�14 涓祴璇曘€�
- `npm run build` 閫氳繃銆�

### 涓嬩竴姝�
1. 鎺ュ叆鐧诲綍椤垫椂锛屾妸 `login` 杩斿洖鐨� token 鍐欏叆 `AuthStorage`銆�
2. 鎺ュ叆鍔ㄦ€佽彍鍗曟椂锛屼娇鐢� `menuApi.getCurrentUserRoutes()` 鏄犲皠鍒扮幇鏈夐潤鎬� route registry銆�
3. 鎺ュ叆鏂囧浘鐢熻棰戠湡瀹炴祦绋嬫椂锛屼紭鍏堜娇鐢� `customerTextImageVideoApi` 鏇挎崲褰撳墠 mock 鏁版嵁婧愩€�
---

## 2026-06-23 鍔ㄦ€佽彍鍗曡矾鐢� OpenSpec 鍒涘缓

### 宸插畬鎴�
- 宸叉鏌� `/api/v1/menus/routes`锛氬綋鍓嶅墠绔� API 灞傚凡鏈� `src/api/system/menus/index.ts` 涓殑 `getCurrentUserRoutes()`锛岃姹傝矾寰勪负 `GET /api/v1/menus/routes`銆�
- 褰撳墠浠撳簱涓昏鏄墠绔伐绋嬶紝鏈彂鐜板悗绔� Controller/Service 瀵硅鎺ュ彛鐨勫疄鐜版枃浠讹紱鏈鍏堝浐瀹氬墠绔鎺ュ绾﹀拰浠诲姟銆�
- 宸叉牴鎹敤鎴锋彁渚涚殑杩斿洖缁撴瀯纭鎺ュ彛鏄亸 Youlai/Vue 椋庢牸鍔ㄦ€佽矾鐢辩粨鏋勶紝鏍稿績瀛楁鍖呮嫭 `path`銆乣component`銆乣redirect`銆乣name`銆乣meta.title`銆乣meta.icon`銆乣meta.hidden`銆乣meta.keepAlive`銆乣meta.alwaysShow`銆乣meta.params`銆乣children`銆�
- 宸插垱寤� OpenSpec change锛歚openspec/changes/connect-dynamic-menu-routes/`銆�
- 宸茶ˉ榻愬苟閫氳繃 OpenSpec 鐘舵€佹鏌ワ細
  - `proposal.md`
  - `design.md`
  - `specs/dynamic-menu-routes/spec.md`
  - `tasks.md`
- 宸叉槑纭叧閿畨鍏ㄨ竟鐣岋細鍚庣杩斿洖鐨� `component: "system/user/index"` 鍙兘浣滀负鍓嶇鐧藉悕鍗曟槧灏勭嚎绱紝涓嶈兘璁� React 鍓嶇鐩存帴鎸夎瀛楃涓插姩鎬� import 缁勪欢銆�

### 褰撳墠鍒ゆ柇
- `/api/v1/menus/routes` 鍦ㄥ墠绔€滃凡鏈夎皟鐢ㄥ叆鍙ｂ€濓紝浣嗚繕娌℃湁瀹屾垚鍔ㄦ€佽彍鍗曘€佸姩鎬佽矾鐢卞拰鍒锋柊鎭㈠鐨勫簲鐢ㄧ骇鎺ュ叆銆�
- 鍔ㄦ€佽矾鐢卞鎺ュ簲閲囩敤鈥滃悗绔彍鍗曞厓鏁版嵁 + 鍓嶇闈欐€� RouteKey/component 娉ㄥ唽琛ㄢ€濈殑妯″瀷锛岄伩鍏嶅悗绔瓧绗︿覆鐩存帴鎺у埗鍓嶇缁勪欢鍔犺浇銆�
- 鍚庣绀轰緥閲岀殑 `children` 涓� `"string"`锛岀湡瀹炴帴鍏ユ椂鍓嶇杞崲鍣ㄥ繀椤诲仛瀹归敊褰掍竴鍖栵紝閬垮厤鎺ュ彛瀛楁寮傚父瀵艰嚧鐧藉睆銆�
- 璇� change 宸茬粡鍏峰杩涘叆瀹炵幇闃舵鐨勫墠缃枃妗ｆ潯浠躲€�

### 涓嬩竴姝�
1. 鐢ㄦ埛纭鍚庯紝鍙紑濮嬫墽琛� `connect-dynamic-menu-routes`銆�
2. 瀹炵幇鏃朵紭鍏堜慨姝� `src/api/system/menus/types.ts` 鍔ㄦ€佽矾鐢辩被鍨嬨€�
3. 鏂板鍚庣 `component` 鍒板墠绔� `RouteKey` 鐨勭櫧鍚嶅崟鏄犲皠鍜屽姩鎬佽矾鐢辫浆鎹㈠櫒銆�
4. 鐢� React Query 鎺ョ `/api/v1/menus/routes`锛屽苟鎺ュ叆搴旂敤鍒濆鍖栥€佷晶杈规爮鑿滃崟鍜屽埛鏂版仮澶嶃€�
5. 琛ュ厖杞崲鍣ㄤ笌鍒锋柊鎭㈠娴嬭瘯锛屾渶鍚庤繍琛� `npm run typecheck`銆乣npm test`銆乣npm run build`銆�

---

## 2026-06-23 璺敱瀹堝崼涓庣櫥褰曡烦杞帓鏌�

### 宸插畬鎴�
- 宸叉鏌ヨ矾鐢卞畧鍗疄鐜帮細`src/app/router/routeGuards.ts`銆�
- 宸叉鏌ヨ矾鐢辨敞鍐岃〃鍜岀櫥褰曢〉锛歚src/app/router/routeRegistry.tsx`銆乣src/pages/LoginPage.tsx`銆�
- 宸叉鏌ュ簲鐢ㄨ矾鐢卞叆鍙ｏ細`src/app/App.tsx`銆�
- 宸叉鏌ョ櫥褰曞け鏁堝鐞嗭細`src/utils/auth.ts`銆乣src/utils/request.ts`銆�
- 宸茶繍琛岄拡瀵规€ф祴璇曪細
  - `npm test -- src/app/router/routeGuards.test.ts src/pages/LoginPage.test.tsx`
  - 娴嬭瘯缁撴灉 2 涓祴璇曟枃浠躲€�6 涓祴璇曞叏閮ㄩ€氳繃銆�

### 褰撳墠鍒ゆ柇
- 褰撳墠浠ｇ爜閲屸€滄湭鐧诲綍鈥濅細鍦� `resolveRouteAccess()` 涓繑鍥� `unauthenticated`锛屼絾 `App.tsx` 娌℃湁娑堣垂杩欎釜缁撴灉锛屾墍浠ュ彈淇濇姢椤甸潰骞朵笉浼氬洜涓烘湭鐧诲綍鑷姩璺宠浆鍒� `/login`銆�
- 褰撳墠浠ｇ爜閲屸€滅櫥褰曞け鏁堚€濅細璋冪敤 `redirectToLogin()`锛岃鍑芥暟鍙細娓呯┖ token 骞舵淳鍙� `auth:expired` 浜嬩欢锛涘綋鍓嶄粨搴撳唴娌℃湁鍙戠幇鐩戝惉璇ヤ簨浠跺苟鎵ц `navigate('/login')` 鐨勯€昏緫锛屽洜姝ょ櫥褰曞け鏁堝悗涔熶笉浼氳嚜鍔ㄨ烦杞埌鐧诲綍椤点€�
- 涔熷氨鏄锛氱洰鍓嶉」鐩凡缁忔湁鐧诲綍椤点€佸彈淇濇姢璺敱鍏冩暟鎹拰鐧诲綍澶辨晥浜嬩欢锛屼絾鈥滃畧鍗垽瀹� -> 鐪熷疄璺宠浆鈥濊繖娈甸摼璺繕娌℃湁鎺ヤ笂銆�

### 涓嬩竴姝�
1. 鍦� `App.tsx` 鎴栧崟鐙殑鍙椾繚鎶よ矾鐢卞叆鍙ｄ腑鎺ュ叆 `resolveRouteAccess()`銆�
2. 鏈櫥褰曡闂� `requiresAuth: true` 璺敱鏃讹紝璺宠浆鍒� `/login?redirect=<褰撳墠璺緞>`銆�
3. 鐩戝惉 `auth:expired` 浜嬩欢锛屾敹鍒板悗璺宠浆鍒扮櫥褰曢〉骞朵繚鐣欐潵婧愯矾寰勩€�
4. 琛ュ厖璺敱璺宠浆绾ф祴璇曪紝瑕嗙洊鏈櫥褰曡闂€佺櫥褰曞悗鍥炶烦銆佺櫥褰曞け鏁堣烦杞笁涓満鏅€�

### 鏈疆琛ュ厖
- 宸插皢鈥滄湭鐧诲綍璁块棶鍙椾繚鎶ら〉璺宠浆鐧诲綍椤碘€濃€滅櫥褰曞け鏁堢粺涓€璺宠浆鐧诲綍椤碘€濃€滅櫥褰曞悗鎸� redirect 鍥炶烦鈥濊ˉ鍏� `openspec/changes/connect-dynamic-menu-routes/tasks.md`銆�
- 宸插悓姝ユ妸瀵瑰簲鐨勬祴璇曢獙璇佷换鍔¤ˉ鍏� OpenSpec锛岄伩鍏嶅悗缁疄鐜版椂鍙慨閫昏緫銆佷笉琛ヨ烦杞祴璇曘€�

---

## 2026-06-23 鐧诲綍椤靛弬鑰冨疄鐜颁笌鏈」鐩€傞厤

### 宸插畬鎴�
- 宸茶鍙栧弬鑰冮」鐩櫥褰曢〉鐩綍锛歚F:\AAA_AI_aisperce\ai-spase\ai-application\application-digital-human\vue3-element-admin\src\views\login`銆�
- 宸叉彁鍙栧弬鑰冪櫥褰曢〉鏍稿績浜や簰缁撴瀯锛氬搧鐗屽尯銆佺櫥褰曞崱鐗囥€佽处鍙峰瘑鐮併€侀獙璇佺爜銆佽浣忔垜銆佸繕璁板瘑鐮併€佹壂鐮佺櫥褰曘€佺粺涓€璁よ瘉鍏ュ彛銆�
- 宸叉寜鏈」鐩妧鏈爤閲嶅缓鐧诲綍椤碉細`src/pages/LoginPage.tsx`锛屼娇鐢� React + TypeScript + Ant Design + TailwindCSS + lucide-react銆�
- 鐧诲綍椤佃瑙夊凡閫傞厤 AI-Hit-Factory 鏆楄壊 SaaS 宸ヤ綔鍙伴鏍硷紝淇濈暀绱鍝佺墝鑹层€丄I 鍐呭鐢熶骇骞冲彴鏂囨鍜屽悎瑙�/鏉冮檺/AI 鐢熶骇鍗栫偣銆�
- 宸叉帴鍏ョ幇鏈夎璇� API锛歚getCaptcha()`銆乣login()`锛岀櫥褰曟垚鍔熷悗鐢遍〉闈㈣皟鐢� `AuthStorage.setTokenPair()` 鍐欏叆 token銆�
- 宸茶ˉ鍏呴獙璇佺爜鏈嶅姟涓嶅彲鐢ㄦ椂鐨勬湰鍦版紨绀洪獙璇佺爜鍏滃簳锛岄伩鍏嶆棤鍚庣鐜涓嬬櫥褰曢〉绌虹櫧銆�
- 宸叉柊澧� `/login` 璺敱锛屽苟閫氳繃 `hideInMenu` 璁╃櫥褰曢〉鐙珛鍏ㄥ睆灞曠ず锛屼笉杩涘叆宸ヤ綔鍙颁晶杈规爮鑿滃崟銆�
- 宸蹭慨姝ｈ姹傚鎴风榛樿瀵煎嚭绫诲瀷锛屼娇 `request.get<T>()`銆乣request.post<T>()` 鍦� TypeScript 涓〃鐜颁负涓氬姟鏁版嵁瑙ｅ寘鍚庣殑 `Promise<T>`銆�
- 宸叉柊澧炵櫥褰曢〉娴嬭瘯锛歚src/pages/LoginPage.test.tsx`銆�
- 宸茶ˉ鍏呮祴璇曠幆澧� `window.matchMedia` mock锛屽吋瀹� Ant Design 鍦� jsdom 涓嬬殑鍝嶅簲寮忚兘鍔涖€�

### 褰撳墠鍒ゆ柇
- 鏈娌℃湁鐓ф惉 Vue + Element Plus 浠ｇ爜锛岃€屾槸澶嶇敤鍏舵垚鐔熺櫥褰曚綋楠岀粨鏋勶紝骞舵寜褰撳墠 React 椤圭洰閲嶆柊瀹炵幇銆�
- 鐧诲綍椤靛綋鍓嶅畬鎴愮殑鏄处鍙峰瘑鐮佺櫥褰曞熀纭€闂幆锛涚煭淇＄櫥褰曘€佹敞鍐屻€佸繕璁板瘑鐮佺湡瀹炴祦绋嬨€佹壂鐮佺櫥褰曞拰缁熶竴璁よ瘉浠嶆槸鍚庣画鎵╁睍鍏ュ彛銆�
- 鐧诲綍鎺ュ彛灞傚彧璐熻矗璇锋眰锛宼oken 鍐欏叆鏀惧湪椤甸潰/浼氳瘽杈圭晫澶勭悊锛岃繖鏍疯兘閬垮厤 API Client 鏆椾腑淇敼鍏ㄥ眬鐘舵€侊紝鍚庣画鎺ョ敤鎴风姸鎬佸拰鍔ㄦ€佽彍鍗曟椂鏇存竻鏅般€�

### 楠岃瘉缁撴灉
- TDD RED锛歚npm test -- src/pages/LoginPage.test.tsx` 棣栨澶辫触锛屽師鍥犳槸 `LoginPage` 灏氫笉瀛樺湪銆�
- 鐧诲綍椤靛崟娴嬮€氳繃锛歚npm test -- src/pages/LoginPage.test.tsx`銆�
- 璺敱涓庣櫥褰曢〉鐩稿叧娴嬭瘯閫氳繃锛歚npm test -- src/app/router/routeRegistry.test.ts src/app/router/routeGuards.test.ts src/pages/LoginPage.test.tsx`銆�
- 绫诲瀷妫€鏌ラ€氳繃锛歚npm run typecheck`銆�
- 鍏ㄩ噺娴嬭瘯閫氳繃锛歚npm test`锛�6 涓祴璇曟枃浠躲€�15 涓祴璇曘€�
- 娴忚鍣ㄨ瑙夋鏌ラ€氳繃锛歚http://127.0.0.1:5173/login` 鍦ㄦ闈㈣鍙ｇ嫭绔嬪叏灞忓睍绀猴紝鏃犲伐浣滃彴渚ц竟鏍忓寘瑁广€�
- 绉诲姩绔鍙ｆ鏌ラ€氳繃锛歚390x844` 涓嬭〃鍗曞湪棣栧睆涓嬪崐閮ㄥ彲瑙侊紝鏃犳枃瀛楅伄鎸°€佹寜閽噸鍙犳垨鐧藉睆闂銆�
- 鐢熶骇鏋勫缓閫氳繃锛歚npm run build`銆�

### 涓嬩竴姝�
1. 鍚姩鏈湴 dev server锛屾祻瑙堝櫒妫€鏌� `/login` 鍦ㄥ父瑙佺獥鍙ｅ昂瀵镐笅鐨勮瑙夋晥鏋溿€�
2. 鍚庣画鎺ュ叆鐪熷疄鍚庣鍚庯紝纭楠岃瘉鐮佽繑鍥炲瓧娈典笌缁熶竴 Result 瑙ｅ寘鏄惁瀹屽叏涓€鑷淬€�
3. 鍦ㄨ处鍙蜂綋绯� change 涓户缁媶鍒嗘敞鍐屻€佸繕璁板瘑鐮併€佺煭淇＄櫥褰曞拰寰俊/鎵爜鐧诲綍鐪熷疄娴佺▼銆�

---

## 2026-06-23 鏁板瓧浜轰换鍔″垱寤轰笌鏂囧浘鐢熻棰戞帴鍙ｅ鎺ヨ皟鐮�

### 宸插畬鎴�
- 宸茬‘璁ゆ湰娆℃敼鍔ㄥ熀浜庡綋鍓嶅墠绔伐绋嬶細`React 19 + Vite + TypeScript + Ant Design + React Query + Axios`銆�
- 宸叉壂鎻忕幇鏈夌浉鍏抽〉闈笌妯″潡锛�
  - `src/pages/DigitalHumansPage.tsx`
  - `src/pages/ImageVideoPage.tsx`
  - `src/api/customer/text-image-video/index.ts`
  - `src/api/customer/text-image-video/types.ts`
- 宸茬‘璁や粨搴撳唴宸茬粡瀛樺湪鈥滄枃鍥剧敓瑙嗛鈥濆熀纭€鎺ュ彛灏佽锛屽綋鍓嶈兘鍔涘寘鎷細
  - 浠诲姟鍒嗛〉鏌ヨ `getTextImageVideoTaskPage`
  - 鍒涘缓浠诲姟 `createTextImageVideoTask`
  - 浠诲姟璇︽儏 `getTextImageVideoTaskDetail`
  - 鍒犻櫎浠诲姟 `deleteTextImageVideoTask`
- 宸查€氳繃娴忚鍣ㄨ闂敤鎴风 Swagger 椤甸潰锛屽苟瀹氫綅鍒扳€滄枃鍥剧敓瑙嗛鈥濇帴鍙ｅ垎缁勫叆鍙ｏ紱褰撳墠宸茬‘璁� Swagger 鍙闂紝鍚庣画灏嗙户缁睍寮€鍏蜂綋 operation銆佽姹備綋涓庤繑鍥炰綋瀛楁銆�
- 宸茶瘑鍒綋鍓嶉〉闈㈢幇鐘讹細
  - `ImageVideoPage` 浠嶄互鏈湴浜や簰鍋囨暟鎹负涓伙紝灏氭湭鎺ュ叆鐪熷疄鍒涘缓浠诲姟/杞缁撴灉/浠诲姟璁板綍鑱斿姩銆�
  - `DigitalHumansPage` 褰撳墠鏄函鍓嶇 mock 绠＄悊椤碉紝灏氭湭涓庣湡瀹炩€滄暟瀛椾汉浠诲姟鍒涘缓鈥濅笟鍔￠摼璺墦閫氥€�
  - 鍏叡浠诲姟鑳藉姏锛堝垱寤恒€佽疆璇€€佺姸鎬佸睍绀恒€佺粨鏋滈瑙堛€侀敊璇鐞嗭級灏氭湭鎶界涓哄彲澶嶇敤妯″潡銆�

### 褰撳墠鍒ゆ柇
- 鏈闇€姹傛湰璐ㄤ笉鏄€滃彧鎺ヤ竴涓寜閽€濓紝鑰屾槸鈥滄枃鍥剧敓瑙嗛浠诲姟鍒涘缓閾捐矾 + 浠诲姟鐘舵€佹祦杞� + 椤甸潰琛ュ叏 + 鍏叡鑳藉姏鎶藉彇鈥濈殑缁勫悎浠诲姟銆�
- 鐜版湁 `text-image-video` API 灏佽鍙槸绗竴灞傝姹傚嚱鏁帮紝璺濈椤甸潰鍙敤杩樼己灏戯細
  - 闈㈠悜琛ㄥ崟鐨勮姹傚弬鏁伴€傞厤灞�
  - 鍒涘缓鍚庝换鍔＄姸鎬佸埛鏂�/杞鏈哄埗
  - 浠诲姟鍒楄〃涓庤鎯呭睍绀虹殑鍏叡鐘舵€佹槧灏�
  - 涓婁紶鍥剧墖銆侀瑙堛€佸紓甯告彁绀恒€佺┖鐘舵€佺瓑椤甸潰绾т綋楠岃ˉ鍏�
- 濡傛灉鏁板瓧浜洪〉闈㈡渶缁堜篃瑕佸鐢ㄢ€滃垱寤哄紓姝ヤ换鍔� -> 鏌ヨ杩涘害 -> 灞曠ず缁撴灉鈥濈殑妯″紡锛屽簲璇ユ娊鍏叡 hook / status helper锛岃€屼笉鏄湪鍗曢〉閲岄噸澶嶅啓涓€濂椼€�

### 涓嬩竴姝�
1. 缁х画鍦� Swagger 涓睍寮€鈥滄枃鍥剧敓瑙嗛鈥濆叿浣撴帴鍙ｏ紝鏍稿鐪熷疄璇锋眰瀛楁銆佽繑鍥炲瓧娈典笌褰撳墠 `types.ts` 鏄惁涓€鑷淬€�
2. 瀵圭収鐜版湁椤甸潰锛屾⒊鐞嗘渶灏忓彲钀藉湴涓氬姟闂幆锛氬垱寤轰换鍔°€佹煡璇换鍔°€佺粨鏋滃睍绀恒€佷换鍔¤褰曡烦杞€�
3. 杈撳嚭 1-2 濂楀墠绔鎺ユ柟妗堝姣旓紝骞跺悜鐢ㄦ埛纭鍏抽敭涓氬姟鍒嗘鐐瑰悗鍐嶈繘鍏ュ疄鐜般€�

---

## 2026-06-23 鍩轰簬鐢ㄦ埛绔枃妗ｅ垱寤烘枃鍥剧敓瑙嗛 OpenSpec 浠诲姟

### 宸插畬鎴�
- 宸茶鍙� `鐢ㄦ埛绔�.md` 涓€滄枃鍥剧敓瑙嗛鈥濇帴鍙ｈ鏄庯紝骞剁‘璁ゅ綋鍓嶅墠绔凡鏈夊熀纭€ API 妯″潡锛�
  - `GET /api/v1/customer/text-image-video/tasks`
  - `POST /api/v1/customer/text-image-video/tasks`
  - `GET /api/v1/customer/text-image-video/tasks/{id}`
  - `DELETE /api/v1/customer/text-image-video/tasks/{id}`
- 宸叉鏌ョ幇鏈夐〉闈笌璺敱鐜扮姸锛�
  - `src/pages/ImageVideoPage.tsx` 浠嶄负婕旂ず鎬佸叆鍙ｉ〉
  - `src/pages/TaskRecordsPage.tsx` 浠嶄负 mock 浠诲姟璁板綍椤�
  - 褰撳墠缂哄皯鏂囧浘鐢熻棰戜笓灞炰换鍔″垪琛ㄩ〉涓庤鎯呴〉
- 宸叉柊寤� OpenSpec change锛歚openspec/changes/add-text-image-video-task-flow/`
- 宸茶ˉ榻愯 change 鐨勫畬鏁� artifacts锛�
  - `proposal.md`
  - `design.md`
  - `specs/text-image-video-task-flow/spec.md`
  - `tasks.md`

### 褰撳墠鍒ゆ柇
- 杩欐鏇撮€傚悎鍗曠嫭鍒涘缓 `add-text-image-video-task-flow`锛岃€屼笉鏄杩涘凡鏈夌殑鈥滅垎娆炬敼缂栤€濇垨鈥滃姩鎬佽矾鐢扁€� change銆�
- 鏂囧浘鐢熻棰戠殑鏍稿績涓嶆槸鍗曢〉琛ㄥ崟锛岃€屾槸鈥滃紓姝ヤ换鍔￠棴鐜€濓紝鎵€浠� OpenSpec 閲屽凡缁忔寜鈥滃叆鍙ｉ〉 + 鍒楄〃椤� + 璇︽儏椤� + 鏈€灏忓叕鍏辫兘鍔涙娊鍙栤€濈殑鏂瑰悜鎷嗚В銆�
- 褰撳墠 spec 娌℃湁杩囧害鎵╁紶鍒版暟瀛椾汉鐪熷疄浠诲姟锛屽彧棰勭暀浜嗗悗缁鐢ㄧ姸鎬佹槧灏勫拰琛ㄥ崟閫傞厤鐨勭┖闂达紝绗﹀悎 KISS 鍘熷垯銆�

### 涓嬩竴姝�
1. 鑻ヤ綘纭杩欎釜 OpenSpec 鎷嗗垎鏂瑰悜娌￠棶棰橈紝鎴戝氨鍙互缁х画鎸� `tasks.md` 鐩存帴杩涘叆瀹炵幇銆�
2. 瀹炵幇鍓嶄細鍏堟牳瀵圭幇鏈� `text-image-video` 绫诲瀷瀹氫箟涓� `鐢ㄦ埛绔�.md` 鐨勫垎椤�/瀛楁缁嗚妭鏄惁瀹屽叏涓€鑷淬€�
3. 姣忓畬鎴愪竴涓疄鐜板皬闃舵锛屾垜浼氱户缁洿鏂� `doc/progress.md`銆�

### 鏈疆瀹炵幇琛ュ厖
- 宸插紑濮嬫墽琛� `add-text-image-video-task-flow`銆�
- 宸插畬鎴愬墠缃⒊鐞嗕换鍔� `1.1 ~ 1.3`锛岀‘璁ゅ綋鍓嶇己鍙ｄ富瑕佸湪涓夊锛�
  - `ImageVideoPage` 浠嶆槸婕旂ず鎬�
  - 缂哄皯鏂囧浘鐢熻棰戜换鍔″垪琛ㄩ〉涓庤鎯呴〉
  - `TaskRecordsPage` 杩樻湭鎺ョ湡瀹炰换鍔″洖鐪嬪叆鍙�
- 宸插畬鎴� API 涓庣被鍨嬪眰浠诲姟 `2.1 ~ 2.4`锛�
  - 淇 `src/api/customer/text-image-video/types.ts`
  - 淇 `src/api/customer/text-image-video/index.ts`
  - 鏂板 `src/api/customer/text-image-video/index.test.ts`
- 褰撳墠鎺ュ彛灞傚凡瀵归綈 `鐢ㄦ埛绔�.md` 涓枃鍥剧敓瑙嗛鐨勫洓涓帴鍙ｏ紝骞舵敮鎸佹敞鍏ユ祴璇� client锛屽拰鐜版湁椤圭洰 API 妯″潡椋庢牸淇濇寔涓€鑷淬€�

### 褰撳墠鍒ゆ柇
- 鏂囧浘鐢熻棰戞帴鍙ｅ綋鍓嶇殑鍒嗛〉缁撴瀯涓庡叡浜� `PageData` 鏄吋瀹圭殑锛屾墍浠ヨ繖涓€姝ヤ笉闇€瑕侀澶栧啀閫犱竴灞傚鏉傚垎椤甸€傞厤銆�
- 鐪熸鐨勫伐浣滈噺浼氶泦涓湪椤甸潰灞傦細浠诲姟鍒涘缓鍚庣殑璺宠浆銆佷换鍔″垪琛ㄣ€佷换鍔¤鎯呭拰鐘舵€佸睍绀猴紝闇€瑕佷竴骞惰ˉ涓娿€�

### 涓嬩竴姝�
1. 鏂板 `src/features/text-image-video` 棰嗗煙鏀拺灞傦紝鍏堟敹鏁涚姸鎬佹槧灏勫拰琛ㄥ崟閫傞厤銆�
2. 鐢� TDD 鏀归€� `ImageVideoPage`锛屾妸鏈湴鍋囩敓鎴愭浛鎹㈡垚鐪熷疄鍒涘缓浠诲姟骞惰烦璇︽儏銆�
3. 鍐嶈ˉ浠诲姟鍒楄〃椤点€佽鎯呴〉鍜岃矾鐢辨帴鍏ャ€�

## 2026-06-23 鍔ㄦ€佽彍鍗曡矾鐢辨帴鍏ョ涓€闃舵

### 宸插畬鎴�
- 寮€濮嬫墽琛� OpenSpec change锛歚connect-dynamic-menu-routes`锛屽苟鎸変换鍔℃竻鍗曟帹杩涘疄鐜般€�
- 纭鍓嶇宸插瓨鍦� `/api/v1/menus/routes` 璋冪敤鍏ュ彛锛歚src/api/system/menus/index.ts#getCurrentUserRoutes()`銆�
- 淇鍔ㄦ€佽矾鐢辫繑鍥炵被鍨嬶細`src/api/system/menus/types.ts` 閲岀殑 `children` 鐜板湪鍏煎鏁扮粍銆佺┖鍊煎拰寮傚父鍊硷紝閬垮厤鎺ュ彛寮傚父鏃剁洿鎺ユ墦宕╁墠绔€�
- 鏂板鍔ㄦ€佽矾鐢辫浆鎹㈠眰锛歚src/app/router/dynamicRoutes.ts`銆�
  - 寤虹珛鍚庣 `component` 鍒板墠绔� `RouteKey` 鐨勭櫧鍚嶅崟鏄犲皠銆�
  - 閫掑綊褰掍竴鍖� `children`銆�
  - 杩囨护鏈煡缁勪欢锛岄伩鍏嶅熀浜庡悗绔瓧绗︿覆鍋氫换鎰忓姩鎬� import銆�
  - 澶勭悊 `meta.hidden`銆乣meta.keepAlive`銆乣meta.alwaysShow`銆乣meta.params`銆乣redirect`銆�
  - 璇嗗埆澶栭摼 `redirect`锛屽苟浠� React Router 鍐呴儴璺敱娉ㄥ唽涓帓闄ゃ€�
- 鎵╁睍鍓嶇瀵艰埅绫诲瀷锛歚src/app/router/routeTypes.ts` 鏂板鍔ㄦ€佽彍鍗�/澶栭摼鑿滃崟鐘舵€佹ā鍨嬨€�
- 鏂板 React Query hook锛歚src/app/router/useCurrentUserRoutes.ts`锛岄€氳繃 Query 缁熶竴鍔犺浇骞惰浆鎹㈠綋鍓嶇敤鎴疯彍鍗曡矾鐢便€�
- 搴旂敤鍏ュ彛鎺ュ叆鍔ㄦ€佽矾鐢卞垵濮嬪寲锛�
  - `src/app/main.tsx` 鎺ュ叆 `QueryClientProvider`銆�
  - `src/app/App.tsx` 鎺ュ叆鐧诲綍鎬佸垽鏂€佸姩鎬佽彍鍗曞姞杞姐€佹湭鐧诲綍璺宠浆銆佺櫥褰曞け鏁堢洃鍚€�403/404 娓叉煋鍜屽彈淇濇姢璺敱鍒锋柊鎭㈠銆�
- 渚ц竟鏍忚彍鍗曟敼涓烘秷璐瑰姩鎬佽彍鍗曠粨鏋滐細`src/app/layouts/DashboardLayout.tsx` 涓嶅啀鐩存帴渚濊禆闈欐€� `routeRegistry` 鐢熸垚鑿滃崟銆�
- 鏇存柊 `.gitignore`锛屾柊澧炲拷鐣� `.playwright-mcp/`锛岄伩鍏嶆祻瑙堝櫒璋冭瘯涓存椂鏂囦欢杩涘叆鎻愪氦銆�
- 鎸� TDD 瀹屾垚骞惰窇閫氶拡瀵规€ф祴璇曪細
  - `src/app/router/dynamicRoutes.test.ts`
  - `src/app/App.test.tsx`

### 褰撳墠鍒ゆ柇
- 鐜板湪宸茬粡鎵撻€氫簡鈥滅櫥褰曞悗鍔犺浇鍔ㄦ€佽彍鍗曗€濆拰鈥滄湭鐧诲綍/鐧诲綍澶辨晥璺崇櫥褰曢〉鈥濈殑涓婚摼璺€�
- 褰撳墠浠嶄繚鐣欓潤鎬� `routeRegistry` 浣滀负瀹夊叏鐧藉悕鍗曚笌 fallback锛岀鍚堣繖娆� change 鐨勮璁¤竟鐣屻€�
- `tasks.md` 涓笌鈥滅被鍨嬨€佽浆鎹㈠櫒銆佸垵濮嬪寲銆佺櫥褰曡烦杞€侀拡瀵规€ф祴璇曗€濈洿鎺ョ浉鍏崇殑灏忛」宸叉洿鏂颁负瀹屾垚銆�

### 楠岃瘉缁撴灉
- `npm test -- src/app/router/dynamicRoutes.test.ts src/app/App.test.tsx` 閫氳繃銆�

### 涓嬩竴姝�
1. 璺戝畬鏁� `npm run typecheck`銆乣npm test`銆乣npm run build`銆�
2. 琛ュ仛娴忚鍣�/鎵嬪姩楠岃瘉锛氬姩鎬佽彍鍗曟覆鏌撱€佸埛鏂版仮澶嶃€佹湭鐧诲綍璺崇櫥褰曘€佺櫥褰曞け鏁堣烦鐧诲綍銆�403/404銆侀殣钘忚彍鍗曘€佸閾捐烦杞€�
3. 缁х画瀹屾垚鍓╀綑 OpenSpec 浠诲姟锛屽挨鍏舵槸鏌ヨ澶辨晥绛栫暐鍜屾祻瑙堝櫒楠岃瘉璁板綍銆�

### 鏈樁娈佃ˉ鍏呴獙璇�
- `npm run typecheck` 閫氳繃銆�
- `npm test` 閫氳繃锛屽綋鍓嶅叡 8 涓祴璇曟枃浠躲€�23 涓祴璇曞叏閮ㄩ€氳繃銆�
- `npm run build` 閫氳繃銆�
- 褰撳墠鏋勫缓瀛樺湪 Vite 璀﹀憡锛歚vendor -> react-vendor -> vendor` 寰幆 chunk 鎻愮ず锛涜繖涓嶆槸鏋勫缓澶辫触锛屼絾鍚庣画鍙互鍗曠嫭浼樺寲 `manualChunks` 瑙勫垯銆�

## 2026-06-23 App 璺敱鍒濆鍖栧娉ㄨˉ鍏�

### 宸插畬鎴�
- 鍦� `src/app/App.tsx` 涓负鍔ㄦ€佽矾鐢卞垵濮嬪寲鍏抽敭鑺傜偣琛ュ厖浜嗕腑鏂囧娉ㄣ€�
- 閲嶇偣璇存槑浜嗭細
  - `publicRoutes` 浣跨敤 `useMemo` 鍥哄畾寮曠敤鐨勫師鍥犮€�
  - `fallbackRouteState` 浣滀负鍔ㄦ€佽彍鍗曞け璐�/鏈繑鍥炴椂鐨勫畧鍗厹搴曚綔鐢ㄣ€�
  - `candidateRoutes` 鍜� `availableRoutes` 鍒嗙鐨勫師鍥狅紝閬垮厤鏈櫥褰曡闂彈淇濇姢椤垫椂璇垽鎴� 404銆�
  - `auth:expired` 浜嬩欢璺宠浆鏃朵负浠€涔堣淇濈暀 `redirect`銆�
  - 闅愯棌璺敱鍛戒腑鏃朵负浠€涔堜晶杈规爮楂樹寒瑕佸洖閫€鍒板彲瑙佽矾鐢便€�

### 褰撳墠鍒ゆ柇
- 杩欐琛ョ殑鏄€滃喅绛栨敞閲娾€濓紝涓嶆槸琛ㄩ潰鎻忚堪锛屽悗闈綘鍐嶇湅 `useMemo` 鍜屽€欓€夎矾鐢卞垽鏂椂浼氭洿椤恒€�
## 2026-06-23 鐧诲綍椤电郴缁熷嚭閿欐帓鏌ヤ笌闄嶅櫔淇
### 宸插畬鎴�
- 宸叉鏌� `src/pages/LoginPage.tsx`銆乣src/api/system/auth/index.ts`銆乣src/utils/request.ts` 涓� `.env.development`
- 宸茬‘璁ゆ姤閿欒Е鍙戠偣鏄櫥褰曢〉鍔犺浇闃舵鑷姩璋冪敤 `GET /api/v1/auth/captcha`
- 宸茬洿鎺ラ獙璇� `VITE_APP_BASE_API=http://192.168.110.145:3000` 褰撳墠杩斿洖鐨勪笉鏄悗绔� JSON锛岃€屾槸涓€涓墠绔� HTML 椤甸潰
- 宸茬‘璁も€滅郴缁熷嚭閿欌€濈殑鏍瑰洜鏄姹傚眰鏈熸湜 `ApiResult`锛屼絾瀹為檯鏀跺埌 HTML锛屽鑷村搷搴旀嫤鎴櫒鎷夸笉鍒颁笟鍔� `code`
- 宸插畬鎴愬墠绔渶灏忛檷鍣慨澶嶏細
  - `src/utils/request.ts`锛氭柊澧� `silentError` 閰嶇疆骞舵寜璇锋眰绮掑害鎺у埗鍏ㄥ眬鎶ラ敊
  - `src/api/shared/utils.ts`锛氭柊澧� `silentError()` 鍏叡鏂规硶
  - `src/api/system/auth/index.ts`锛氳 `getCaptcha()` 闈欓粯澶辫触骞剁户缁蛋鐧诲綍椤� fallback 楠岃瘉鐮�
  - `src/utils/request.test.ts`锛氭柊澧為潤榛橀敊璇祴璇�

### 褰撳墠鍒ゆ柇
- 杩欐浠ｇ爜淇瑙ｅ喅鐨勬槸鈥滆瀵兼€у叏灞€鎶ラ敊鍣煶鈥濓紝涓嶆槸鍚庣鍦板潃鏍瑰洜鏈韩
- 褰撳墠鐧诲綍椤靛湪楠岃瘉鐮佹帴鍙ｅけ璐ユ椂锛屽簲缁х画鏄剧ず鏈湴 fallback 楠岃瘉鐮侊紝涓嶅啀棰濆鍒峰嚭鈥滅郴缁熷嚭閿欌€�
- 鐪熸鎭㈠鑱旇皟锛屼粛闇€瑕佹妸 `.env.development` 涓殑 `VITE_APP_BASE_API` 鏀规垚鐪熷疄鍚庣缃戝叧鍦板潃
- 浠庡綋鍓嶈瘉鎹湅锛宍192.168.110.145:3000` 鏇村儚鍙︿竴涓墠绔紑鍙戞湇鍔★紝涓嶅儚鎵胯浇 `/api/v1/auth/captcha` 鐨勫悗绔湇鍔�

### 楠岃瘉缁撴灉
- `npm test -- src/utils/request.test.ts` 閫氳繃
- `npm run typecheck` 閫氳繃

### 涓嬩竴姝�
1. 纭鐪熷疄鍚庣缃戝叧鍦板潃鎴栫鍙ｏ紝淇 `.env.development` 涓殑 `VITE_APP_BASE_API`
2. 閲嶆柊楠岃瘉 `GET /api/v1/auth/captcha` 涓� `POST //api/v1/customer/auth/login`
3. 濡傛湁闇€瑕侊紝缁х画閫愬瓧娈靛榻愬悗绔湡瀹炶繑鍥炵粨鏋勪笌鍓嶇 `CaptchaInfo` / `AuthenticationToken` 绫诲瀷

## 2026-06-23 鏁板瓧浜鸿棰戞帴鍙ｆ枃妗ｈ瘑鍒ˉ鍏�

### 宸插畬鎴�
- 宸茬‘璁ゆ湰娆＄洰鏍囦笉鏄崟绾€滆瘑鍒竴涓摼鎺モ€濓紝鑰屾槸瑕佷粠 Swagger 鏂囨。閲屾壘鍒扳€滃垱寤烘暟瀛椾汉瑙嗛浠诲姟鈥濇墍闇€鐨勭湡瀹炶姹傚瓧娈点€�
- 宸叉壂鎻忓綋鍓嶅墠绔浉鍏虫枃浠讹細
  - `src/pages/ImageVideoPage.tsx`
  - `src/pages/DigitalHumansPage.tsx`
  - `src/api/customer/text-image-video/index.ts`
  - `src/api/customer/text-image-video/types.ts`
- 宸茬‘璁ゅ綋鍓嶅墠绔� `TextImageVideoCreateRequest` 鍙湁锛�
  - `imageUrls: string[]`
  - `prompt: string`
  - `model?: string`
- 宸插垽鏂繖浠藉墠绔被鍨嬭繕娌℃湁瑕嗙洊浣犳彁鍒扮殑鈥滄暟瀛椾汉瑙嗛涓嬫媺妗嗏€濊涔夛紝鍥犳涓嶈兘鐩存帴鎸夌幇鏈夌被鍨嬪紑鍋氾紝鍚﹀垯澶ф鐜囦細鎶婃樉绀烘枃妗堣褰撴垚鐪熷疄鎻愪氦鍊笺€�

### 褰撳墠鍒ゆ柇
- 杩欐鐪熸鍏抽敭鐨勬槸鍏堟嬁鍒� Swagger 椤甸潰閲� create 鎺ュ彛鐨勭湡瀹炲瓧娈点€佸瓧娈电被鍨嬨€佸繀濉鍒欙紝浠ュ強鈥滄暟瀛椾汉瑙嗛鈥濅笅鎷夋鐨勬灇涓惧€笺€�
- 鍙湁鎷垮埌杩欎釜濂戠害锛屽墠绔墠鑳藉喅瀹氭槸锛�
  - 鎵╁睍鐜版湁 `text-image-video` 璇锋眰绫诲瀷锛�
  - 杩樻槸鏂板涓€涓洿璐磋繎鈥滄暟瀛椾汉瑙嗛浠诲姟鈥濈殑鐙珛 API 灏佽銆�

### 涓嬩竴姝�
1. 閫氳繃娴忚鍣ㄧ洿鎺ヨ鍙� Swagger 椤甸噷鐨� create 鎺ュ彛琛ㄥ崟缁撴瀯銆�
2. 鏍稿鈥滄暟瀛椾汉瑙嗛鈥濅笅鎷夋瀵瑰簲鐨勫瓧娈靛悕銆佹灇涓惧€煎拰鍊肩被鍨嬨€�
3. 杈撳嚭鍓嶇鎺ュ叆鏂规锛屽啀鍐冲畾鏄惁寮€濮嬫敼浠ｇ爜銆�

## 2026-06-23 鏁板瓧浜鸿棰戞枃妗ｈ闂樆濉炶ˉ鍏�

### 宸插畬鎴�
- 宸查獙璇佸唴缃戠洰鏍� `192.168.110.145:8000` 鐨� TCP 8000 绔彛鍙繛閫氾紝璇存槑涓嶆槸绾补鐨勭鍙ｄ笉鍙揪闂銆�
- 宸插垎鍒皾璇曚互涓嬫柟寮忚鍙� Swagger/OpenAPI 鏂囨。锛�
  - PowerShell `Invoke-WebRequest` 璁块棶 `doc.html`
  - `curl.exe` 璁块棶 `doc.html`
  - 搴旂敤鍐呮祻瑙堝櫒鐩存帴鎵撳紑 `doc.html#/绯荤粺绠＄悊/08.AIGC-鏁板瓧浜鸿棰�/create`
- 宸茬‘璁ゅ綋鍓嶇幆澧冧笅涓婅堪鏂瑰紡閮芥病鏈夋垚鍔熸嬁鍒伴〉闈㈠唴瀹规垨鎺ュ彛瀹氫箟锛岃〃鐜颁负瓒呮椂鎴栨棤娉曞缓绔嬪彲鐢ㄩ〉闈笂涓嬫枃銆�

### 褰撳墠鍒ゆ柇
- 鐜板湪鐨勯樆濉炵偣涓嶆槸鍓嶇涓嶄細鎺ワ紝鑰屾槸鑷姩鍖栫幆澧冩殏鏃舵嬁涓嶅埌浣犲唴缃� Swagger 椤电殑鐪熷疄 DOM / OpenAPI 鏁版嵁銆�
- 鍦ㄦ病鏈夋帴鍙ｇ湡瀹炲瓧娈靛墠锛岀户缁啓浠ｇ爜椋庨櫓寰堥珮锛屽洜涓哄鏄撴妸锛�
  - 椤甸潰灞曠ず鏂囨
  - 涓嬫媺妗� label
  - 瀹為檯鎻愪氦 value
  - 鍚庣 DTO 瀛楁鍚�
  娣锋垚涓€濂楋紝鏈€缁堝鑷磋姹備綋涓嶅銆�

### 涓嬩竴姝�
1. 浼樺厛璁╃敤鎴锋彁渚涜 create 鎺ュ彛灞曞紑鍚庣殑鎴浘锛岀壒鍒槸璇锋眰鍙傛暟鍖哄拰涓嬫媺妗嗛€夐」鍖恒€�
2. 濡傛灉鑳芥彁渚� `curl` / 璇锋眰绀轰緥 / Swagger 鐨� Request URL 涓� Request Body 绀轰緥锛屼篃鍙互鐩存帴鍙嶆帹鍑哄墠绔被鍨嬨€�
3. 鎷垮埌鐪熷疄瀛楁鍚庯紝鍐嶈緭鍑衡€滃鐢ㄧ幇鏈� `text-image-video`鈥濊繕鏄€滄柊澧炴暟瀛椾汉瑙嗛 API 妯″潡鈥濈殑瀵规帴鏂规銆�

## 2026-06-23 Swagger 閾炬帴鍙闂€у鏍�

### 宸插畬鎴�
- 宸插鏍� `http://192.168.110.145:8000/doc.html#/绯荤粺绠＄悊/08.AIGC-鏁板瓧浜鸿棰�/create` 鐨勫熀纭€鍙闂€с€�
- 宸茬‘璁� `192.168.110.145:8000` 绔彛鍙繛閫氾細
  - `TcpTestSucceeded : True`
- 宸茬‘璁� `doc.html` 鑳借繑鍥� HTTP 200銆�
- 宸茬‘璁よ繑鍥炲唴瀹逛笉鏄姤閿欓〉锛岃€屾槸 Knife4j 鍓嶇澹抽〉闈紝闈欐€� HTML 澶х害 `1903` 瀛楄妭锛屽寘鍚細
  - `webjars/js/app.c31badf5.js`
  - `webjars/js/chunk-vendors.d51cf6f8.js`
  - `div id=\"app\"`
- 宸叉姄鍒伴〉闈富鑴氭湰 `webjars/js/app.c31badf5.js`锛岃鏄庢枃妗ｅ墠绔潤鎬佽祫婧愪篃鑳芥甯歌闂€�

### 褰撳墠鍒ゆ柇
- 鐜板湪鍙互鏄庣‘璇达細杩欎釜 Swagger/Knife4j 閾炬帴鈥滈〉闈㈠叆鍙ｆ湰韬槸鍙互璁块棶鐨勨€濄€�
- 浣嗚繖杩樺彧璇佹槑鈥滄枃妗ｅ墠绔３鍙墦寮€鈥濓紝涓嶇瓑浜庘€滃叿浣撴帴鍙ｆ暟鎹凡缁忔垚鍔熸覆鏌撳嚭鏉モ€濄€�
- 濡傛灉鍚庣画瑕佺户缁嚜鍔ㄨ瘑鍒� `create` 鎺ュ彛閲岀殑瀛楁锛屼笅涓€姝ュ簲缁х画楠岃瘉锛�
  - Knife4j 杩愯鏃跺疄闄呰姹傜殑 `swagger-resources` / `api-docs` 鍦板潃锛�
  - 杩欎簺璧勬簮鏄惁杩斿洖鎺ュ彛鍒嗙粍涓� `08.AIGC-鏁板瓧浜鸿棰�/create` 鐨勭湡瀹� schema銆�

### 涓嬩竴姝�
1. 缁х画浠� Knife4j 杩愯鑴氭湰涓畾浣嶅畠瀹為檯浣跨敤鐨勮祫婧愬湴鍧€銆�
2. 璇诲彇瀵瑰簲 `swagger-resources` 鎴� `api-docs` 鏁版嵁锛岀‘璁� create 鎺ュ彛璇锋眰浣撱€�
3. 鎷垮埌 schema 鍚庡啀鍥炲～鍓嶇 DTO 鍜岃〃鍗曟彁浜ら€昏緫銆�

## 2026-06-23 鐧诲綍椤甸獙璇佺爜杩斿洖缁撴瀯鏍稿
### 宸插畬鎴�
- 宸叉壂鎻忕櫥褰曢〉楠岃瘉鐮侀摼璺細
  - `src/pages/LoginPage.tsx`
  - `src/api/system/auth/index.ts`
  - `src/api/system/auth/types.ts`
  - `src/utils/request.ts`
- 宸茬‘璁ゅ綋鍓嶉〉闈㈠睍绀哄眰浣跨敤锛�
  - `captcha.captchaBase64` 浣滀负 `<img src>`
  - `captcha.captchaId` 浣滀负鐧诲綍鎻愪氦鍙傛暟
- 宸茬‘璁や綘鍒氭彁渚涚殑鐪熷疄杩斿洖绀轰緥锛�
  - `captchaBase64: "data:image/png;base64,..."`
  - `captchaId: "6ee84d8a508343a5a69850b482c8eb7d"`
  涓庡綋鍓嶅墠绔睍绀烘ā鍨嬫槸鍏煎鐨�
- 宸插鏍告湰鍦版帴鍙ｆ枃妗� `鐢ㄦ埛绔�.md`锛屽彂鐜版枃妗ｄ腑浠嶅瓨鍦ㄥ巻鍙插懡鍚嶏細
  - 鑾峰彇楠岃瘉鐮佽繑鍥炲瓧娈靛啓鐨勬槸 `captchaId`
  - 鐧诲綍璇锋眰瀛楁涔熷啓鐨勬槸 `captchaId`
- 宸茬‘璁ゅ綋鍓� `.env.development` 鎸囧悜锛�
  - `VITE_APP_BASE_API='http://192.168.110.145:8000'`

### 褰撳墠鍒ゆ柇
- 鐜板湪鐨勬牳蹇冪煕鐩惧凡缁忎笉鏄€滈獙璇佺爜鍥剧墖鎬庝箞鏄剧ず鈥濓紝鍥犱负鍓嶇瀵� `data:image/png;base64,...` 杩欑鏍煎紡澶╃劧鍏煎銆�
- 鐪熸闇€瑕佽鎯曠殑鏄€滃瓧娈靛懡鍚嶆紓绉烩€濓細
  - 鐪熷疄鍚庣鐜板湪鐪嬭捣鏉ヤ娇鐢� `captchaId`
  - 鏈湴鏂囨。娈嬬暀鐨勬槸 `captchaId`
  - 褰撳墠鍓嶇鎻愪氦鐨勬槸 `captchaId`
- 浠庣涓€鎬у師鐞嗙湅锛岃繖灏卞儚鍓嶇琛ㄥ崟瀛楁鍚嶅拰鍚庣 DTO 灞炴€у悕涓嶄竴鑷达細椤甸潰鑳芥覆鏌擄紝涓嶄唬琛ㄧ櫥褰曡姹備竴瀹氳兘杩囥€傞獙璇佺爜鏈韩鍙槸灞曠ず璧勬簮锛岀湡姝ｅ奖鍝嶆牎楠岀殑鏄€滃悗绔敓鎴愰獙璇佺爜鏃跺彂缁欎綘鐨勬爣璇嗏€濆拰鈥滀綘鐧诲綍鏃跺啀鍥炰紶鐨勬爣璇嗏€濇槸鍚﹀畬鍏ㄥ悓鍚嶅悓鍊笺€�

### 涓嬩竴姝�
1. 浼樺厛鎸夆€滅湡瀹炴帴鍙ｈ繑鍥炩€濆榻愬墠绔被鍨嬪拰鐧诲綍鎻愪氦娴佺▼锛屼笉鍐嶄互鏃ф枃妗ｉ噷鐨� `captchaId` 浣滀负鍑嗙怀銆�
2. 鏈€灏忔敼娉曟槸璁╁墠绔吋瀹� `captchaId`锛屽繀瑕佹椂棰濆鍏煎鏃у瓧娈� `captchaId`锛岄伩鍏嶈仈璋冩湡闂存柊鏃у悗绔笉涓€鑷村鑷撮樆濉炪€�
3. 鍦ㄥ姩浠ｇ爜鍓嶏紝鍏堢‘璁や綘甯屾湜閲囩敤鈥滃彧瀵归綈鏂版帴鍙ｂ€濊繕鏄€滄柊鏃у瓧娈靛弻鍏煎鈥濇柟妗堛€�

## 2026-06-23 鐧诲綍椤甸獙璇佺爜鍥剧墖涓嶆樉绀烘牴鍥犳帓鏌�
### 宸插畬鎴�
- 宸茬洿鎺ヨ姹傜湡瀹炴帴鍙� `GET http://192.168.110.145:8000/api/v1/auth/captcha`
- 宸茬‘璁ゅ悗绔湡瀹炶繑鍥炰负锛�
  - `code: "00000"`
  - `data.captchaId`
  - `data.captchaBase64: "data:image/png;base64,..." `
- 宸茬‘璁� `captchaBase64` 鏈韩鏄畬鏁寸殑 Data URL锛岃€屼笉鏄８ base64锛屽洜姝や粠娴忚鍣� `<img src>` 瑙勫垯鐪嬪彲浠ョ洿鎺ユ覆鏌�
- 宸插鏍稿墠绔姹傝В鍖呴€昏緫锛�
  - `src/utils/request.ts` 褰撳墠浠呮妸 `code === "200"` 瑙嗕负鎴愬姛
  - 鐪熷疄鍚庣鎴愬姛鐮佹槸 `00000`
- 宸插鏍哥櫥褰曢〉鍒锋柊閫昏緫锛�
  - `src/pages/LoginPage.tsx` 涓� `refreshCaptcha()` 鍙湁鍦� `getCaptcha()` resolve 鏃舵墠浼� `setCaptcha(nextCaptcha)`
  - 涓€鏃﹁姹傚眰鎶� `00000` 鍒ゆ垚澶辫触锛屽氨浼氱洿鎺ヨ繘鍏� `catch`锛屽洖閫€鍒版湰鍦� fallback 楠岃瘉鐮�

### 褰撳墠鍒ゆ柇
- 杩欐鐜拌薄涓嶆槸鈥滄湁鏁版嵁浣� `<img>` 涓嶈鈥濓紝鑰屾槸鈥滃悗绔暟鎹湪璇锋眰灞傚氨琚嫤鎴垚澶辫触锛屾墍浠ラ〉闈㈡牴鏈病鍚冨埌閭ｄ唤鏁版嵁鈥濄€�
- 浠庤皟鐢ㄩ摼鐪嬶細
  - 鍚庣杩斿洖浜嗙湡瀹為獙璇佺爜鍥剧墖
  - `request.ts` 鎶� `00000` 璇垽鎴愬け璐�
  - `getCaptcha()` reject
  - `LoginPage.refreshCaptcha()` 杩涘叆 `catch`
  - 椤甸潰鏄剧ず鐨勬槸 fallback锛岃€屼笉鏄帴鍙ｈ繑鍥炲浘
- 杩欏拰鍓嶇/鍚庣鍗忎綔閲屽緢甯歌鐨勨€滀笟鍔℃垚鍔熺爜绾﹀畾涓嶄竴鑷粹€濇槸鍚屼竴绫婚棶棰樸€傜被姣斿墠绔粍浠堕€氫俊锛屽氨鏄埗缁勪欢鏄庢槑鎶婃暟鎹紶涓嬫潵浜嗭紝浣嗕腑闂撮€傞厤灞傛妸瀹冨綋寮傚父涓㈡帀浜嗭紝瀛愮粍浠惰嚜鐒舵嬁涓嶅埌銆�

### 涓嬩竴姝�
1. 鎶婅姹傚眰鎴愬姛鐮佷粠鍗曚竴 `200` 璋冩暣涓哄吋瀹瑰綋鍓嶅悗绔殑 `00000`
2. 鍚屾琛ヤ竴鏉″洖褰掓祴璇曪紝瑕嗙洊 `ApiResult.code === "00000"` 鐨勬垚鍔熻В鍖�
3. 鍐嶅洖鐪嬬櫥褰曟帴鍙ｆ槸鍚︿篃浣跨敤鍚屼竴鎴愬姛鐮侊紝閬垮厤楠岃瘉鐮佷慨濂戒絾鐧诲綍浠嶈璇垽澶辫触

## 2026-06-23 楠岃瘉鐮佹垚鍔熺爜鍏煎淇
### 宸插畬鎴�
- 宸叉寜 TDD 鏈€灏忛棴鐜ˉ鍏呰姹傚眰鍥炲綊娴嬭瘯锛�
  - `src/utils/request.test.ts`
  - 鏂板鐢ㄤ緥瑕嗙洊 `code === "00000"` 鏃跺簲姝ｅ父瑙ｅ寘 `data`
- 宸插厛鎵ц绾㈢伅楠岃瘉锛岀‘璁ゆ棫瀹炵幇浼氭妸 `00000` 璇垽涓哄け璐�
- 宸叉渶灏忎慨鏀硅姹傚眰鎴愬姛鐮佸垽鏂細
  - `src/utils/request.ts`
  - 淇濈暀鍘熸湁 `200`
  - 鏂板鍏煎 `00000`
  - 鎶藉嚭 `isSuccessfulBusinessCode()`锛岄伩鍏嶅悗缁暎钀界‖缂栫爜

### 褰撳墠鍒ゆ柇
- 鐜板湪鐧诲綍椤靛埛鏂伴獙璇佺爜鏃讹紝鐪熷疄鍚庣杩斿洖鐨� `captchaBase64` 宸茬粡鍙互绌胯繃璇锋眰灞傦紝鍒拌揪 `LoginPage` 鐨� `captcha` 鐘舵€併€�
- 杩欐淇殑鏄€滅粺涓€鍝嶅簲閫傞厤灞傗€濓紝鏀剁泭涓嶅彧鍦ㄩ獙璇佺爜锛屽嚒鏄悓鏍疯繑鍥� `code: "00000"` 鐨勬帴鍙ｉ兘浼氫竴璧峰彈鐩娿€�
- 浠庡悗绔師鐞嗙湅锛岃繖涓€灞傚氨鍍忓墠绔殑鍏叡鍝嶅簲閫傞厤鍣紱濡傛灉杩欓噷鎶婃垚鍔熺爜鍒ら敊锛屼笅闈㈡墍鏈夐〉闈㈢粍浠堕兘浼氳〃鐜板緱鍍忊€滄帴鍙ｅけ璐モ€濓紝鍗充娇缃戠粶鍜屾暟鎹湰韬兘娌￠棶棰樸€�

### 楠岃瘉缁撴灉
- `npm test -- src/utils/request.test.ts` 閫氳繃
- `npm run typecheck` 閫氳繃

### 涓嬩竴姝�
1. 鍒锋柊鐧诲綍椤碉紝纭鐪熷疄楠岃瘉鐮佸浘鐗囧凡缁忔樉绀猴紝涓嶅啀鍥為€€鍒版湰鍦� fallback
2. 瀹炴祴涓€娆＄櫥褰曟帴鍙ｏ紝纭瀹冧篃浣跨敤 `00000` 鎴愬姛鐮佸苟鑳芥甯歌繘鍏ョ郴缁�
3. 濡傛湁蹇呰锛屽啀琛ヤ竴鏉� `LoginPage` 绾у埆娴嬭瘯锛岄獙璇侀獙璇佺爜鍥剧墖浣跨敤鐨勬槸鎺ュ彛杩斿洖鍥捐€屼笉鏄� fallback

## 2026-06-23 鐧诲綍鎴愬姛璺宠浆琛屼负纭
### 宸插畬鎴�
- 宸插鏍哥櫥褰曢〉鎻愪氦鎴愬姛鍚庣殑璺宠浆閾捐矾锛�
  - `src/pages/LoginPage.tsx`
  - `src/app/App.tsx`
- 宸茬‘璁ょ櫥褰曟垚鍔熷悗浼氭墽琛屾湰鍦拌矾鐢辫烦杞紝鑰屼笉鏄仠鐣欏湪鐧诲綍椤�

### 褰撳墠鍒ゆ柇
- 鐧诲綍鎴愬姛鍚庯紝`handleSubmit()` 浼氬厛鍐欏叆 token锛屽啀鎵ц `navigate(redirectPath, { replace: true })`
- `redirectPath` 鐨勬潵婧愭槸锛�
  - 濡傛灉鐧诲綍椤� URL 涓婂甫鏈� `?redirect=...`锛屽氨璺冲洖鐢ㄦ埛鍘熸湰鎯宠闂殑椤甸潰
  - 濡傛灉娌℃湁锛屽氨榛樿璺冲埌 `/`
- 杩欏睘浜庡墠绔矾鐢辫烦杞紝鍘熺悊涓婄被浼煎崟椤靛簲鐢ㄩ噷 `router.push`锛屼笉浼氭暣椤靛埛鏂�

### 涓嬩竴姝�
1. 濡傞渶杩涗竴姝ョ‘璁よ仈璋冪粨鏋滐紝鍙洿鎺ュ疄娴嬩竴娆＄湡瀹炵櫥褰曟帴鍙�
2. 濡傞渶鍏滃簳楠岃瘉锛屽彲琛ョ櫥褰曟垚鍔熷悗鐨勯〉闈㈣烦杞祴璇�

## 2026-06-23 棣栨鐧诲綍鏀瑰瘑闇€姹傝瘑鍒�
### 宸插畬鎴�
- 宸叉壂鎻忓綋鍓嶈璇佺浉鍏虫枃浠讹細
  - `src/pages/LoginPage.tsx`
  - `src/api/system/auth/index.ts`
  - `src/api/system/auth/types.ts`
- 宸插湪 `鐢ㄦ埛绔�.md` 涓‘璁ゅ瓨鍦ㄧ敤鎴风鏀瑰瘑鎺ュ彛锛�
  - `POST /api/v1/customer/auth/change-password`
  - 濂戠害璇箟锛氶獙璇佹棫瀵嗙爜 + 閲嶇疆瀵嗙爜 + token 澶辨晥
- 宸插湪鏂囨。涓瘑鍒埌鐧诲綍鎬佽繑鍥炲瓧娈甸噷瀛樺湪锛�
  - `needChangePassword`锛岃涔変负鈥滄槸鍚﹂渶瑕佹敼瀵嗭細1=鏄紝0=鍚︹€�

### 褰撳墠鍒ゆ柇
- 杩欐闇€姹傛湰璐ㄤ笉鏄€滃啀鍔犱竴涓敼瀵嗛〉闈⑩€濓紝鑰屾槸缁欑櫥褰曢摼璺ˉ涓€鏉♀€滈娆＄櫥褰曞繀椤绘敼瀵嗏€濈殑鍒嗘敮銆�
- 浠庣涓€鎬у師鐞嗙湅锛岃繖鏄竴鏉¤璇佺姸鎬佹満鍒嗘敮锛�
  - 鏅€氱敤鎴凤細鐧诲綍鎴愬姛 -> 鍐欏叆 token -> 杩涘叆绯荤粺
  - 棣栫櫥鐢ㄦ埛锛氱櫥褰曟垚鍔熶絾鍛戒腑 `needChangePassword=1` -> 杩涘叆鏀瑰瘑娴佺▼ -> 鏀瑰瘑鎴愬姛鍚� token 澶辨晥 -> 閲嶆柊鐧诲綍
- 褰撳墠浠ｇ爜閲岃繕娌℃湁鎵挎帴杩欎釜鐘舵€佺殑 UI銆丄PI 绫诲瀷鍜� token 澶辨晥鍚庣殑鍓嶇鏀跺彛閫昏緫銆�

### 涓嬩竴姝�
1. 鍏堢‘瀹氶鐧绘敼瀵嗙殑浜や簰褰㈡€佷笌鏈€灏忕姸鎬佹祦杞�
2. 鍐嶇粰鍑� 1-2 濂楁帴鍏ユ柟妗堝姣�
3. 寰呮柟妗堢‘璁ゅ悗鍐嶈繘鍏ュ疄鐜�

## 2026-06-23 棣栫櫥鏀瑰瘑浜や簰纭
### 宸插畬鎴�
- 宸叉牴鎹� `鐢ㄦ埛绔�.md` 澶嶆牳涓ゆ鍏抽敭濂戠害锛�
  - 鐧诲綍璇锋眰瀛楁锛歚phone + password + captchaId + captchaCode`
  - 瀹㈡埛鏀瑰瘑瀛楁锛歚oldPassword + newPassword + confirmPassword`
- 宸茬粨鍚堜綘缁欏嚭鐨勭湡瀹炵櫥褰曡繑鍥烇紝纭闇€瑕佹柊澧炰竴涓壒娈婄櫥褰曠粨鏋滃垎鏀細
  - `code: "C10001"`
  - `msg: "璇峰厛淇敼鍒濆瀵嗙爜"`
  - `data` 涓粛鐒朵細甯� `accessToken / refreshToken / tokenType / expiresIn`
- 宸茬‘璁ゆ湰娆′氦浜掓柟妗堜笉鏄烦杞嫭绔嬮〉锛岃€屾槸锛�
  - 鍛戒腑 `C10001` 鍚庯紝灏嗗綋鍓嶇櫥褰曡〃鍗曞垏鎹㈡垚閲嶇疆瀵嗙爜琛ㄥ崟

### 褰撳墠鍒ゆ柇
- 杩欐剰鍛崇潃鐧诲綍鎺ュ彛涓嶅啀鍙湁鈥滄垚鍔� / 澶辫触鈥濅袱鎬侊紝鑰屾槸涓夋€侊細
  - 鏅€氭垚鍔燂細杩涘叆绯荤粺
  - 棣栫櫥寰呮敼瀵嗭細鍒囨崲琛ㄥ崟
  - 鏅€氬け璐ワ細缁х画鍋滅暀鐧诲綍琛ㄥ崟
- 浠庤璇佸師鐞嗙湅锛宍C10001` 鏇村儚鈥滃彈闄愭垚鍔熲€濊€屼笉鏄交搴曞け璐ャ€傚悗绔凡缁忕粰浜� token锛屼絾涓氬姟涓婁笉鍏佽鐩存帴杩涘叆绯荤粺锛屽彧鍏佽缁х画瀹屾垚鏀瑰瘑銆�
- 鍓嶇鏈€绋崇殑鍋氭硶涓嶆槸鎶婅繖绫昏繑鍥炲己琛屽綋寮傚父鎶涙帀锛岃€屾槸鏄惧紡寤轰竴涓€滈渶瑕佹敼瀵嗏€濈殑鍒嗘敮鐘舵€佹潵鎵挎帴銆�

### 涓嬩竴姝�
1. 鍦ㄨ璇佽姹傚眰鎴� auth 妯″潡璇嗗埆 `C10001`
2. 鍦� `LoginPage` 涓紩鍏モ€滅櫥褰曡〃鍗� / 棣栫櫥鏀瑰瘑琛ㄥ崟鈥濆弻鐘舵€佸垏鎹�
3. 鏀瑰瘑鎴愬姛鍚庝富鍔ㄦ竻鐞� token锛屽苟鍥炲埌鏅€氱櫥褰曟€侀噸鏂扮櫥褰�

## 2026-06-23 鐢ㄦ埛绔帴鍙ｆ枃妗ｇ撼鍏ラ」鐩笂涓嬫枃
### 宸插畬鎴�
- 宸茬‘璁や粨搴撴牴鐩綍鏂板鎺ュ彛鏂囨。锛歚F:\AAA_AI_aisperce\AI-Hit-Factory\鐢ㄦ埛绔�.md`
- 宸插皢璇ユ枃妗ｈ瘑鍒负鈥滅敤鎴风鎺ュ彛鐨� Markdown 姹囨€绘枃妗ｂ€濓紝鍚庣画鍓嶇瀵规帴鍙互浼樺厛鍩轰簬杩欎唤鏈湴鏂囨。鍋氬瓧娈垫绱�
- 宸插垵姝ヨ瘑鍒枃妗ｈ鐩栫殑涓昏鎺ュ彛鍩燂細
  - 瀹㈡埛绔璇侊細鐧诲綍銆侀€€鍑恒€佸埛鏂� token銆佸浘褰㈤獙璇佺爜
  - 鏂囧浘鐢熻棰戯細浠诲姟鍒楄〃銆佸垱寤轰换鍔°€佷换鍔¤鎯呫€佸垹闄や换鍔�
  - AIGC 瑙嗛鏀圭紪/鐖嗘鏀瑰啓鐩稿叧浠诲姟
- 宸插鐓у綋鍓嶅墠绔唬鐮佺‘璁わ紝鐩存帴鐩稿叧鐨勭幇鏈夋ā鍧楀寘鎷細
  - `src/api/customer/text-image-video/index.ts`
  - `src/api/aigc/uploads/index.ts`
  - `src/pages/LoginPage.tsx`

### 褰撳墠鍒ゆ柇
- 杩欎唤 `鐢ㄦ埛绔�.md` 宸茬粡鍙互浣滀负鍚庣画鈥滄帴鍙ｅ瓧娈垫牳瀵广€佺被鍨嬭ˉ鍏ㄣ€佽姹傝矾寰勬牎楠屸€濈殑鏈湴鍩虹嚎璧勬枡锛岃兘鍑忓皯鍙嶅鍘昏繙绋� Swagger 椤甸潰妫€绱㈢殑鎴愭湰
- 鐩墠鍦ㄧ粓绔鍙栨椂瀛樺湪鏄庢樉涓枃涔辩爜锛岃鏄庢枃妗ｇ紪鐮佸拰褰撳墠缁堢瑙ｇ爜涔嬮棿鍙兘涓嶄竴鑷达紱鍦ㄦ寮忎緷璧栧畠閫愬瓧娈靛榻愪箣鍓嶏紝鏈€濂藉厛纭鍘熸枃浠舵槸鍚︿负 UTF-8
- 浠庡凡璇嗗埆鍐呭鐪嬶紝`/api/v1/customer/text-image-video/tasks` 涓庡綋鍓嶅墠绔凡鏈夊皝瑁呭熀鏈槸瀵归綈鐨勶紝涓嬩竴姝ラ€傚悎缁х画鏍稿鐧诲綍鎺ュ彛瀛楁涓庣幇鏈夎璇佹ā鍧楁槸鍚﹀畬鍏ㄤ竴鑷�

### 涓嬩竴姝�
1. 濡傛灉鍚庣画寮€濮嬪仛鈥滅敤鎴风鐪熷疄鑱旇皟鈥濓紝浼樺厛浠� `鐢ㄦ埛绔�.md` 鎶藉彇鏄庣‘鎺ュ彛濂戠害锛屽啀鍚屾鍒� `types.ts` 鍜岄〉闈㈣〃鍗�
2. 濡傛湁闇€瑕侊紝鍙户缁妸 `鐢ㄦ埛绔�.md` 涓€滅櫥褰� + 鏂囧浘鐢熻棰戔€濇暣鐞嗘垚鍓嶇鍙洿鎺ヤ娇鐢ㄧ殑鎺ュ彛瀵圭収娓呭崟
3. 濡傛灉浣犳€€鐤戞枃妗ｇ紪鐮佹湁闂锛屾垜鍙互涓嬩竴姝ュ彧鍋氱紪鐮佹帓鏌ワ紝涓嶆敼鏂囨。鍐呭
# 椤圭洰杩涘睍璁板綍

## 2026-06-23 瑙嗛杩界垎浠诲姟鑼冨洿璋冪爺
### 宸插畬鎴�
- 宸插畾浣� `鐢ㄦ埛绔�.md` 涓� `08.AIGC-瑙嗛杩界垎` 鐩稿叧鎺ュ彛锛屽綋鍓嶅凡璇嗗埆鍒扮殑鏍稿績鑳藉姏鍖呮嫭锛�
  - 鍒嗛〉鏌ヨ杩界垎浠诲姟鍒楄〃锛歚GET /api/aigc/video-remix-tasks`
  - 鍒涘缓杩界垎浠诲姟锛歚POST /api/aigc/video-remix-tasks`
  - 杩界垎浠诲姟璇︽儏
  - 鍒犻櫎杩界垎浠诲姟
  - 淇濆瓨杩界垎琛ㄥ崟
  - 鍒锋柊杩界垎浠诲姟鐘舵€�
- 宸叉壂鎻忓墠绔幇鐘跺苟纭鈥滅垎娆捐棰戞敼缂栤€濆綋鍓嶅彧钀戒簡婕旂ず椤甸潰锛�
  - 椤甸潰锛歚src/pages/ViralRemixPage.tsx`
  - 璺敱锛歚src/app/router/routeRegistry.tsx`
  - 閫氱敤浠诲姟椤碉細`src/pages/TaskRecordsPage.tsx`
- 宸茬‘璁ゅ綋鍓嶄粨搴撻噷杩樻病鏈夊搴旂殑鈥滆棰戣拷鐖嗕换鍔♀€� API 妯″潡锛沗src/api` 鐜版湁 AIGC 鐩稿叧灏佽鍙湁涓婁紶鎺ュ彛鍜屸€滃浘鏂囩敓瑙嗛鈥濇帴鍙ｃ€�
- 宸茶瘑鍒幇鏈夌己鍙ｄ富瑕佷笉鍦� UI 楠ㄦ灦锛岃€屽湪涓氬姟闂幆缂哄け锛�
  - 缂哄皯瑙嗛杩界垎浠诲姟 API 灏佽涓庣被鍨嬪畾涔�
  - 缂哄皯杩界垎浠诲姟鍒楄〃涓庣瓫閫夊鎺�
  - 缂哄皯杩界垎浠诲姟璇︽儏 / 琛ㄥ崟鍥炲～鑳藉姏
  - 缂哄皯鈥滀繚瀛樿〃鍗曗€濅笌鈥滃埛鏂扮姸鎬佲€濆姩浣滄壙鎺�
  - 褰撳墠 `TaskRecordsPage` 浠嶆槸 mock 鏁版嵁锛屼笉鏄拷鐖嗙湡瀹炰换鍔¤褰曢〉

### 褰撳墠鍒ゆ柇
- 杩欐鈥滄牴鎹� `鐢ㄦ埛绔�.md` 鍒涘缓瀵瑰簲浠诲姟鈥濇洿閫傚悎鍏堟寜鈥滄帴鍙ｈ兘鍔� -> 椤甸潰鑳藉姏 -> 缂哄け椤甸潰/鐘舵€佲€濆仛浠诲姟鎷嗗垎锛岃€屼笉鏄洿鎺ュ湪鐜版湁 `ViralRemixPage` 涓婇浂鏁ｅ姞鎸夐挳銆�
- 浠庣涓€鎬у師鐞嗙湅锛宍瑙嗛杩界垎` 鏈川鏄€滃紓姝ヤ换鍔＄郴缁熲€濓細
  - 鍒涘缓浠诲姟鍍忓墠绔彂璧蜂竴娆℃彁浜ゅ姩浣�
  - 淇濆瓨琛ㄥ崟鍍忚崏绋挎寔涔呭寲
  - 鍒锋柊鐘舵€佸儚鍓嶇杞鎴栨墜鍔ㄥ埛鏂颁换鍔＄粨鏋�
  - 璇︽儏椤佃礋璐ｆ妸浠诲姟褰撳墠鐘舵€併€佽〃鍗曞揩鐓у拰缁撴灉鑱氬悎灞曠ず
- 濡傛灉鐩存帴鎶婅繖浜涢€昏緫鍏ㄥ杩� `ViralRemixPage.tsx`锛屾枃浠朵細杩呴€熻啫鑳€锛屽悗缁帴鐪熷疄鎺ュ彛鍜屾祴璇曢兘涓嶅ソ缁存姢锛涙洿绋冲Ε鐨勬槸鎷嗘垚 API銆侀〉闈㈠鍣ㄣ€佺姸鎬佹槧灏勫拰澶嶇敤缁勪欢鍥涘眰銆�

### 涓嬩竴姝�
1. 缁х画浠� `鐢ㄦ埛绔�.md` 鎶藉彇瑙嗛杩界垎鎺ュ彛鐨勫瓧娈电骇濂戠害锛岃ˉ榻愬墠绔换鍔℃竻鍗曘€�
2. 杈撳嚭鈥滃凡鏈夐〉闈㈠鐢ㄤ粈涔堛€佺己澶遍〉闈㈤渶瑕佹墜鍔ㄨˉ鍝簺鈥濈殑瀹炴柦鏂规銆�
3. 寰呬綘纭鍚庯紝鍐嶈繘鍏ユ寮忎换鍔℃枃妗ｆ垨鐩存帴寮€濮嬭ˉ椤甸潰瀹炵幇銆�

## 2026-06-23 瑙嗛杩界垎浠诲姟鏂囨。浜у嚭
### 宸插畬鎴�
- 宸插熀浜� `鐢ㄦ埛绔�.md` 鐨� `08.AIGC-瑙嗛杩界垎` 杈撳嚭浠诲姟瀹炴柦鏂囨。锛�
  - `F:\AAA_AI_aisperce\AI-Hit-Factory\doc\2026-06-23-video-remix-task-plan.md`
- 宸插湪鏂囨。涓槑纭細
  - 鎺ㄨ崘閲囩敤鈥滀笁椤甸棴鐜€濇柟妗堬紝鑰屼笉鏄户缁妸鎵€鏈夐€昏緫鍫嗗湪 `ViralRemixPage.tsx`
  - 鐜版湁鍙鐢ㄩ〉闈細`src/pages/ViralRemixPage.tsx`
  - 闇€瑕佹墜鍔ㄨˉ鍏呯殑缂哄け椤甸潰锛�
    - `src/pages/VideoRemixTasksPage.tsx`
    - `src/pages/VideoRemixTaskDetailPage.tsx`
  - 闇€瑕佹柊澧炵殑 API 妯″潡锛�
    - `src/api/aigc/video-remix-tasks/types.ts`
    - `src/api/aigc/video-remix-tasks/index.ts`
  - 闇€瑕佽鐩栫殑浠诲姟鍔ㄤ綔锛�
    - 鍒楄〃鏌ヨ
    - 鍒涘缓浠诲姟
    - 璇︽儏鍥炲～
    - 淇濆瓨琛ㄥ崟
    - 鏍￠獙 Prompt
    - 鐢熸垚 Prompt
    - 鐢熸垚瑙嗛
    - 鍒锋柊鐘舵€�
    - 鍒犻櫎浠诲姟
- 宸茶ˉ鍏呮枃浠剁骇瀹炴柦璁″垝銆佸垎姝ヤ换鍔℃竻鍗曘€佹帹鑽愰『搴忓拰楠岃瘉姝ラ锛屽悗缁彲浠ョ洿鎺ユ寜鏂囨。杩涘叆缂栫爜銆�

### 褰撳墠鍒ゆ柇
- 鐜板湪鈥滆棰戣拷鐖嗏€濊繖鍧楀凡缁忓叿澶囨槑纭疄鏂借竟鐣岋紝涓嬩竴姝ヤ笉闇€瑕佸啀娉涜皟鐮旓紝鍙互鐩存帴杩涘叆瀹炵幇闃舵銆�
- 鏈€鍏抽敭鐨勫伐绋嬬偣涓嶆槸 UI 閫犲瀷锛岃€屾槸鎶娾€滃紓姝ヤ换鍔℃祦鈥濆拰鈥滆〃鍗曡崏绋挎祦鈥濆垎娓呮锛涜繖浼氱洿鎺ュ喅瀹氬悗缁唬鐮佹槸鍚﹀鏄撶淮鎶ゃ€�

### 涓嬩竴姝�
1. 鎸変换鍔℃枃妗ｅ厛琛� `video-remix-tasks` API 涓庣被鍨嬪畾涔夈€�
2. 鍐嶈ˉ杩界垎璇︽儏椤碉紝浼樺厛鎵撻€氣€滃垱寤� -> 璇︽儏 -> 淇濆瓨 -> 鐢熸垚 -> 鍒锋柊鈥濅富閾捐矾銆�
3. 鏈€鍚庤ˉ杩界垎浠诲姟鍒楄〃椤典笌璺敱鑿滃崟鎺ュ叆銆�

## 2026-06-23 瑙嗛杩界垎 OpenSpec 浠诲姟鍒涘缓瀹屾垚
### 宸插畬鎴�
- 宸叉柊寤� OpenSpec change锛�
  - `openspec/changes/add-video-remix-task-flow/`
- 宸茶ˉ榻愯 change 鐨勫畬鏁村洓浠跺锛�
  - `proposal.md`
  - `design.md`
  - `specs/video-remix-task-flow/spec.md`
  - `tasks.md`
- 宸插皢鈥滄櫘閫氫换鍔℃枃妗ｂ€濋噷鐨勭粨璁烘敹鏁涗负姝ｅ紡 OpenSpec 鑳藉姏锛�
  - 鑳藉姏鍚嶏細`video-remix-task-flow`
  - 鑼冨洿锛氳棰戣拷鐖嗙湡瀹炰换鍔℃祦銆佺己澶遍〉闈㈣ˉ榻愩€佽矾鐢辨帴鍏ャ€佹帴鍙ｄ笌椤甸潰娴嬭瘯
- 宸查€氳繃 `openspec status --change add-video-remix-task-flow` 纭璇ュ彉鏇� `4/4 artifacts complete`锛岃揪鍒板彲杩涘叆瀹炵幇闃舵鐨勭姸鎬�

### 褰撳墠鍒ゆ柇
- 鐜板湪杩欎欢浜嬪凡缁忎笉鍐嶆槸闆舵暎闇€姹傛暣鐞嗭紝鑰屾槸涓€鏉″畬鏁淬€佸彲鎵ц鐨� OpenSpec change銆�
- 鍚庣画鏈€鍚堢悊鐨勬帹杩涙柟寮忥紝灏辨槸鐩存帴鍩轰簬 `add-video-remix-task-flow` 杩涘叆 `/opsx:apply` 鎴栬鎴戠户缁寜浠诲姟瀹炵幇銆�

### 涓嬩竴姝�
1. 璇诲彇 `openspec/changes/add-video-remix-task-flow/tasks.md`锛屾寜椤哄簭寮€濮嬪疄鐜般€�
2. 浼樺厛琛� `src/api/aigc/video-remix-tasks/*`锛屽啀琛ヨ鎯呴〉涓婚摼璺€�
3. 鏈€鍚庤ˉ浠诲姟鍒楄〃椤点€佽矾鐢辨帴鍏ヤ笌娴嬭瘯楠岃瘉銆�

## 2026-06-23 瑙嗛杩界垎瀹炵幇绗竴闃舵锛欰PI 濂戠害灞�
### 宸插畬鎴�
- 宸叉寜 OpenSpec change `add-video-remix-task-flow` 寮€濮嬪疄鐜帮紝骞跺畬鎴愮 1 缁勪笌绗� 2 缁勪换鍔★細
  - 宸查槄璇� `openspec/config.yaml`銆乣openspec/project.md`銆乣proposal.md`銆乣design.md`銆乣spec.md`
  - 宸插鐓� `鐢ㄦ埛绔�.md` 鏁寸悊瑙嗛杩界垎 9 涓帴鍙�
  - 宸茬‘璁ゅ垎椤佃繑鍥炰笌鐜版湁鍏变韩绫诲瀷瀛樺湪宸紓锛氬悗绔繑鍥� `records/total/current/size`
- 宸叉柊澧炶棰戣拷鐖� API 妯″潡锛�
  - `src/api/aigc/video-remix-tasks/types.ts`
  - `src/api/aigc/video-remix-tasks/index.ts`
- 宸插畬鎴愮殑鎺ュ彛鑳藉姏鍖呮嫭锛�
  - 鍒楄〃鏌ヨ
  - 鍒涘缓浠诲姟
  - 浠诲姟璇︽儏
  - 鍒犻櫎浠诲姟
  - 淇濆瓨琛ㄥ崟
  - 鏍￠獙 Prompt
  - 鐢熸垚 Prompt
  - 鐢熸垚瑙嗛
  - 鍒锋柊鐘舵€�
- 宸插湪 API 灞傚畬鎴愬垎椤甸€傞厤锛屾妸 `records` 缁撴瀯杞崲涓哄墠绔洿绋冲畾鐨� `list/total/pageNum/pageSize/pages`
- 宸叉柊澧炴帴鍙ｅ眰娴嬭瘯锛�
  - `src/api/aigc/video-remix-tasks/index.test.ts`
- 宸查獙璇佹湰闃舵瀹氬悜娴嬭瘯閫氳繃锛�
  - `npm test -- src/api/aigc/video-remix-tasks/index.test.ts`

### 褰撳墠鍒ゆ柇
- 褰撳墠鍙互纭锛氳棰戣拷鐖嗙殑 API 濂戠害灞傚凡缁忓叿澶囩户缁線椤甸潰瀹炵幇鎺ㄨ繘鐨勫熀纭€銆�
- 浣嗗湪杩涘叆涓嬩竴闃舵 `src/features/video-remix/status.ts` 鍓嶏紝鍑虹幇浜嗕竴涓槑纭己鍙ｏ細
  - `鐢ㄦ埛绔�.md` 鍙啓浜� `status 0~7`锛屾病鏈夌粰鍑烘瘡涓姸鎬佺爜鐨勭簿纭笟鍔¤涔�
  - 杩欎細鐩存帴褰卞搷鍓嶇鍚庣画鐨勭姸鎬侀鑹层€佹寜閽彲鐢ㄦ€с€佸け璐�/澶勭悊涓�/鍙敓鎴�/鍙埛鏂板垽鏂�
- 杩欎竴缂哄彛瀵� API 灞備笉鏄樆濉烇紝浣嗗涓嬩竴闃舵鈥滅姸鎬佹槧灏勫拰椤甸潰琛屼负鈥濇槸瀹炶川闃诲锛涘鏋滅户缁‖鍐欙紝浼氬紑濮嬮潬鐚溿€�

### 涓嬩竴姝�
1. 绛夊緟鐢ㄦ埛琛ュ厖 `status 0~7` 鐨勭姸鎬佽涔夎鏄庯紝鎴栨彁渚涘悗绔灇涓�/鎴浘銆�
2. 鎷垮埌鐘舵€佸畾涔夊悗锛屽啀缁х画瀹炵幇 `src/features/video-remix/status.ts`銆佽鎯呴〉鍔ㄤ綔鎸夐挳鍜岀粨鏋滃尯琛屼负銆�
3. 鑻ョ敤鎴峰悓鎰忎互 `statusLabel` 涓哄噯鍋氬厹搴曞疄鐜帮紝涔熷彲缁х画鎺ㄨ繘锛屼絾闇€瑕佹槑纭繖鏄复鏃剁瓥鐣ャ€�
## 2026-06-23 瑙嗛杩界垎瀹炵幇绗簩闃舵锛氳矾鐢变笌鍏ュ彛椤垫祴璇曞缓妗�
### 宸插畬鎴�
- 宸茶ˉ鍏呰棰戣拷鐖嗕换鍔℃祦绗竴鎵瑰畾鍚戞祴璇曪細
  - `src/app/router/routeRegistry.test.ts`
  - `src/app/router/dynamicRoutes.test.ts`
  - `src/pages/ViralRemixPage.test.tsx`
- 宸插湪绫诲瀷灞傞鐣欒拷鐖嗕换鍔″垪琛ㄩ〉涓庤鎯呴〉 route key锛屼綔涓哄悗缁矾鐢辨敞鍐屽墠缃€�
- 宸叉墽琛屽畾鍚戞祴璇曞懡浠わ細
  - `npm test -- src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts src/pages/ViralRemixPage.test.tsx`

### 褰撳墠鍒ゆ柇
- 褰撳墠绾㈢伅缁撹绗﹀悎棰勬湡锛屼富瑕佷笟鍔＄己鍙ｆ槑纭负锛�
  - 杩界垎浠诲姟鍒楄〃椤� / 璇︽儏椤靛皻鏈敞鍐屽埌璺敱琛�
  - 鍚庣鑿滃崟缁勪欢鍒拌拷鐖嗕换鍔″垪琛ㄩ〉鐨勬槧灏勫皻鏈ˉ榻�
  - `ViralRemixPage` 灏氭湭鎺ュ叆鈥滃垱寤鸿拷鐖嗕换鍔″苟璺宠浆璇︽儏椤碘€濈殑鐪熷疄琛屼负
- 鍚屾椂鍙戠幇涓€涓祴璇曞眰闂锛歚ViralRemixPage.test.tsx` 鍒濈増 mock 瑙﹀彂浜� Vitest hoist 闄愬埗銆傝繖涓笉鏄笟鍔￠樆濉烇紝宸茶浆鍏ヤ慨姝ｆ祴璇曞啓娉曞悗閲嶆柊楠岃瘉銆�

### 涓嬩竴姝�
1. 淇 `ViralRemixPage.test.tsx` 鐨� mock 鍐欐硶骞堕噸鏂版墽琛屽畾鍚戞祴璇曘€�
2. 鍦ㄧ‘璁ょ孩鐏函鍑€鍚庯紝杩涘叆缁胯壊瀹炵幇闃舵銆�
3. 缁х画琛ラ綈 feature helper銆侀〉闈€€佽矾鐢变笌璇︽儏椤典富閾捐矾銆�

## 2026-06-23 瑙嗛杩界垎瀹炵幇绗笁闃舵锛氳〃鍗曟墿灞曚笌浠撳簱缂哄彛纭
### 宸插畬鎴�
- 宸查噸鏂板榻� OpenSpec change `add-video-remix-task-flow` 鐨� `proposal.md`銆乣design.md`銆乣spec.md` 涓� `tasks.md`锛岀‘璁ゆ湰杞洰鏍囨槸鈥滃熀浜庣幇鏈夐〉闈㈡墿灞曚换鍔℃祦锛屽苟鎸夋帴鍙ｅ弬鏁拌ˉ榻愭柊澧�/缂栬緫琛ㄥ崟鈥濄€�
- 宸插鏍稿綋鍓嶈棰戣拷鐖嗙浉鍏冲疄鐜版枃浠讹細
  - `src/pages/ViralRemixPage.tsx`
  - `src/pages/VideoRemixTasksPage.tsx`
  - `src/pages/VideoRemixTaskDetailPage.tsx`
  - `src/features/video-remix/form.ts`
  - `src/features/video-remix/status.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/dynamicRoutes.ts`
- 宸叉墽琛屾湰杞畾鍚戞祴璇曪細
  - `npm test -- src/pages/ViralRemixPage.test.tsx src/features/video-remix/status.test.ts src/features/video-remix/form.test.ts src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts`
- 宸茬‘璁や笌鏈瑙嗛杩界垎浠诲姟鐩存帴鐩稿叧鐨勭孩鐏細
  - `src/features/video-remix/form.ts` 涓� `mapFormValuesToSavePayload()` 瀵瑰彲閫夊瓧绗︿覆瀛楁鐩存帴璋冪敤 `.trim()`锛屽鑷存柊澧�/缂栬緫琛ㄥ崟鏄犲皠娴嬭瘯澶辫触銆�
- 宸茬‘璁や細闃绘柇缁х画鍏ㄩ噺璺敱娴嬭瘯鐨勪粨搴撶幇瀛樼己鍙ｏ細
  - `content.imageVideoTasks`
  - `content.imageVideoTaskDetail`
  - 瀵瑰簲 route registry 灏氭湭娉ㄥ唽锛岀浉鍏抽〉闈㈡枃浠舵鍓嶄篃鏈ˉ榻愶紝瀵艰嚧 `routeRegistry.test.ts` 涓� `dynamicRoutes.test.ts` 涓€滄枃鍥剧敓瑙嗛浠诲姟椤碘€濇柇瑷€鐩存帴澶辫触銆�

### 褰撳墠鍒ゆ柇
- 鐜板湪涓嶆槸鍙湁鈥滆棰戣拷鐖嗚〃鍗曟墿灞曗€濅竴涓棶棰橈紝鑰屾槸鍚屾椂鏆撮湶鍑轰簡鈥滀粨搴撶幇瀛樼殑鏂囧浘鐢熻棰戜换鍔¤矾鐢辩己鍙ｂ€濄€�
- 濡傛灉缁х画鎸夊綋鍓嶆祴璇曢泦鎺ㄨ繘锛屾垜鏃犳硶鎶娾€滄湰娆℃柊澧為棶棰樷€濆拰鈥滀粨搴撳凡鏈夌己鍙ｂ€濆共鍑€鍒嗙锛屽悗缁綘鐪嬪埌鐨勬祴璇曠粨鏋滀細娣峰湪涓€璧枫€�
- 鎸夊綋鍓嶄换鍔¤竟鐣岀湅锛屾垜鍙互缁х画鍙慨瑙嗛杩界垎涓婚摼璺湰韬紝浣嗗鏋滆瀹ｇО杩欒疆璺敱鐩稿叧娴嬭瘯閫氳繃锛屽繀椤诲厛鍐冲畾鏄惁涓€骞惰ˉ `imageVideoTasks` 杩欑粍鍘嗗彶缂哄彛銆�

### 涓嬩竴姝�
1. 绛変綘纭鏄惁鍏佽鎴戦『鎵嬭ˉ榻� `imageVideoTasks` / `imageVideoTaskDetail` 杩欑粍鐜板瓨璺敱缂哄彛銆�
2. 濡傛灉浣犲笇鏈涗弗鏍煎彧鍋氳棰戣拷鐖嗭紝鎴戜細鍙户缁慨锛�
   - `form.ts` 琛ㄥ崟鏄犲皠鍏滃簳
   - `ViralRemixPage.tsx` / `VideoRemixTasksPage.tsx` 鐨� mutation 绛惧悕
   - `routeRegistry.tsx` 涓棰戣拷鐖嗛〉闈㈢湡瀹炴敞鍐�
3. 纭鑼冨洿鍚庯紝鎴戝啀缁х画鍐欎唬鐮佸苟鍥炶窇瀵瑰簲娴嬭瘯銆�

## 2026-06-23 宸ヤ綔鍙板搧鐗屼贡鐮佹畫鐣欎慨澶�
- 宸查拡瀵光€滈〉闈腑浠嶅嚭鐜� `AI 閻栧棙顑欏銉ュ范`鈥濈户缁帓鏌ュ墠绔彲瑙佹枃妗堟潵婧愩€�
- 宸茬‘璁ゆ牴鍥犱綅浜� `src/app/layouts/DashboardLayout.tsx`锛屼笉鏄櫥褰曢〉锛屼篃涓嶆槸鎺ュ彛杩斿洖锛岃€屾槸宸ヤ綔鍙板３灞傛簮鐮侀噷浠嶆畫鐣欓敊璇紪鐮佸悗鐨勪腑鏂囥€�
- 宸蹭慨澶嶄互涓嬪彲瑙佹枃妗堬細
  - 鍝佺墝鍚嶏細`AI 鐖嗘宸ュ巶`
  - 鍓爣棰橈細`鍐呭鐢熶骇骞冲彴`
  - 鎶樺彔鎸夐挳锛歚灞曞紑渚ц竟鏍� / 鏀惰捣渚ц竟鏍廯
  - 椤堕儴鎸夐挳锛歚閫氱煡`
  - 鐢ㄦ埛鏄电О锛歚鍟嗗鐢ㄦ埛`
- 宸叉柊澧炵粍浠剁骇鍥炲綊娴嬭瘯锛歚src/app/layouts/DashboardLayout.test.tsx`
- 宸叉墽琛屽畾鍚戦獙璇侊細
  - `npm test -- src/app/layouts/DashboardLayout.test.tsx`
  - 缁撴灉锛歚1 passed, 2 tests passed`
- 宸插啀娆″叏鏂囨悳绱㈠綋鍓嶈繖缁勪贡鐮佸叧閿瘝锛宍src` 涓嬫湭鍐嶅彂鐜板悓绫绘畫鐣欍€�

### 褰撳墠鍒ゆ柇
- 杩欐闂鏈川鏄竷灞€澹冲眰婧愮爜涓粛瀛樺湪鍘嗗彶涔辩爜锛岃€屼笉鏄笟鍔℃帴鍙ｇ紪鐮侀棶棰樸€�
- 浠庡師鐞嗕笂鐪嬶紝鍍忚繖绉嶁€滄墍鏈夐〉闈㈤兘鍖呯潃鐨� Layout 鏂囨鈥濅竴鏃︽湁涔辩爜锛屼細璁╀綘璇互涓烘暣涓郴缁熻繕鏈夊ぇ閲忕紪鐮佸紓甯革紱瀹為檯搴斾紭鍏堟帓鏌ュ３灞傜粍浠讹紝鍥犱负瀹冨儚鍓嶇鐨勫叏灞€瀵艰埅锛屼篃鍍忓悗绔殑缁熶竴涓棿浠跺叆鍙ｏ紝浼氭斁澶ч棶棰樺彲瑙佽寖鍥淬€�

### 涓嬩竴姝�
1. 浣犲埛鏂板綋鍓嶉〉闈㈠悗锛屼晶鏍忓搧鐗屽悕搴斿凡鎭㈠涓� `AI 鐖嗘宸ュ巶`銆�
2. 濡傛灉浣犺繕鑳界湅鍒板叾浠栦贡鐮侊紝鎴戜細缁х画鎸夆€滃彲瑙侀〉闈� -> 瀵瑰簲婧愮爜缁勪欢 -> 鏈€灏忔祴璇曞厹搴曗€濈殑鏂瑰紡閫愪釜娓呮帀銆�

## 2026-06-23 鏂囧浘鐢熻棰戝疄鐜扮浜岄樁娈碉細椤甸潰闂幆涓庤矾鐢辨帴鍏�

### 宸插畬鎴�
- 宸叉寜 `鐢ㄦ埛绔�.md` 鐨勬枃鍥剧敓瑙嗛鎺ュ彛濂戠害瀹屾垚鐪熷疄浠诲姟娴侀〉闈㈤棴鐜紝瀵规帴鎺ュ彛鍖呮嫭锛�
  - `GET /api/v1/customer/text-image-video/tasks`
  - `POST /api/v1/customer/text-image-video/tasks`
  - `GET /api/v1/customer/text-image-video/tasks/{id}`
  - `DELETE /api/v1/customer/text-image-video/tasks/{id}`
- 宸茶ˉ榻愭枃鍥剧敓瑙嗛棰嗗煙鏈€灏忓叕鍏辫兘鍔涳細
  - `src/features/text-image-video/status.ts`
  - `src/features/text-image-video/form.ts`
- 宸叉敼閫犲垱寤洪〉锛屾墦閫氣€滀笂浼犲弬鑰冨浘 -> 鍒涘缓浠诲姟 -> 璺宠浆璇︽儏鈥濈殑鐪熷疄閾捐矾锛�
  - `src/pages/ImageVideoPage.tsx`
- 宸叉柊澧炰换鍔″垪琛ㄩ〉涓庤鎯呴〉锛岃ˉ榻愪换鍔″洖鐪嬭兘鍔涳細
  - `src/pages/TextImageVideoTasksPage.tsx`
  - `src/pages/TextImageVideoTaskDetailPage.tsx`
- 宸插畬鎴愯矾鐢辨帴鍏ヤ笌鍔ㄦ€佺粍浠舵槧灏勮ˉ榻愶細
  - `src/app/router/routeTypes.ts`
  - `src/app/router/routeRegistry.tsx`
  - `src/app/router/dynamicRoutes.ts`
- 宸茶ˉ鍏呭畾鍚戞祴璇曞苟閫氳繃锛�
  - `src/features/text-image-video/status.test.ts`
  - `src/features/text-image-video/form.test.ts`
  - `src/pages/ImageVideoPage.test.tsx`
  - `src/pages/TextImageVideoTasksPage.test.tsx`
  - `src/pages/TextImageVideoTaskDetailPage.test.tsx`
  - `src/app/router/routeRegistry.test.ts`
  - `src/app/router/dynamicRoutes.test.ts`
- 宸查獙璇佸畾鍚戝懡浠ら€氳繃锛�
  - `npm test -- src/features/text-image-video/status.test.ts src/features/text-image-video/form.test.ts src/pages/ImageVideoPage.test.tsx src/pages/TextImageVideoTasksPage.test.tsx src/pages/TextImageVideoTaskDetailPage.test.tsx src/app/router/routeRegistry.test.ts src/app/router/dynamicRoutes.test.ts`
  - 缁撴灉锛歚7 passed, 24 tests passed`

### 褰撳墠鍒ゆ柇
- 鏂囧浘鐢熻棰戝凡缁忎粠鍗曢〉 mock 婕旂ず锛屾帹杩涗负鈥滀笁椤甸棴鐜€濈殑鐪熷疄寮傛浠诲姟娴侊細
  - `/image-video`
  - `/image-video/tasks`
  - `/image-video/tasks/:taskId`
- 杩欐鍏叡鑳藉姏鎶藉彇淇濇寔鍦� feature 鍐呮渶灏忚寖鍥达紝娌℃湁鎻愬墠鎶借薄鎴愬叏绔欏紓姝ヤ换鍔℃鏋讹紝绗﹀悎褰撳墠浠撳簱 KISS 鍘熷垯銆�
- 鎺ュ彛鐘舵€佸睍绀洪噰鍙栤€滀紭鍏堜娇鐢ㄥ悗绔� `statusLabel`锛屽啀缁撳悎 `status / videoUrl / errReason / syncError` 鍓嶇鍏滃簳鈥濈殑绛栫暐锛屽彲浠ラ檷浣庡悗绔姸鎬佹灇涓炬湭瀹屽叏鍏紑甯︽潵鐨勮€﹀悎椋庨櫓銆�
- 涓轰簡涓嶈浠撳簱鍘嗗彶缂哄彛鍗′綇锛岃繖杞『鎵嬭ˉ杩涗簡鏂囧浘鐢熻棰戜换鍔¤矾鐢� key 鍜屽姩鎬佹槧灏勶紱鍚屾椂涔熻ˉ浜嗚拷鐖嗕换鍔＄殑鍗犱綅璺敱鏄犲皠锛岄伩鍏嶇幇鏈夎矾鐢辨祴璇曠户缁鍘嗗彶闂闃绘柇銆�

### 閬楃暀涓庝笅涓€姝�
1. 缁х画鍋氬叏閲忛獙璇侊細
   - `npm run typecheck`
   - `npm test`
   - `npm run build`
2. 璇勪及 `openspec/changes/add-text-image-video-task-flow/tasks.md` 涓� `5.4` 鏄惁闇€瑕佽ˉ `TaskRecordsPage` 鍒扮湡瀹炴枃鍥剧敓瑙嗛浠诲姟椤电殑鍥炶烦鍏ュ彛銆�
3. 瑙嗗叏閲忛獙璇佺粨鏋滐紝鍐嶅喅瀹氭槸鍚﹂『鎵嬫竻鐞嗘枃鍥剧敓瑙嗛椤甸潰婧愮爜涓殑鍘嗗彶涔辩爜鏂囨鏄剧ず闂銆�

## 2026-06-23 鏂囧浘鐢熻棰戝疄鐜扮涓夐樁娈碉細鍏ㄩ噺楠岃瘉涓庡洖褰掓敹鏁�

### 宸插畬鎴�
- 宸叉墽琛屽叏閲忛獙璇佸懡浠わ細
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- 宸蹭慨澶嶉獙璇佽繃绋嬩腑鏆撮湶鐨勫洖褰掗棶棰橈細
  - `src/features/video-remix/form.ts`
  - `src/features/video-remix/form.test.ts`
  - `src/pages/TextImageVideoTasksPage.tsx`
  - `src/pages/ViralRemixPage.tsx`
  - `src/pages/VideoRemixTasksPage.tsx`
  - `src/pages/upload-integration.test.tsx`
- 宸茬‘璁ら獙璇佺粨鏋滐細
  - `typecheck` 閫氳繃
  - `vitest` 鍏ㄩ噺閫氳繃锛歚21 passed, 64 tests passed`
  - `vite build` 閫氳繃

### 褰撳墠鍒ゆ柇
- 褰撳墠鏂囧浘鐢熻棰戜换鍔℃祦鐨勪唬鐮併€佹祴璇曚笌鏋勫缓閾捐矾宸茬粡闂幆锛岄€氳繃浜嗕粠绫诲瀷銆佸崟娴嬪埌鐢熶骇鏋勫缓鐨勫畬鏁存牎楠屻€�
- 杩欒疆椤烘墜淇帀鐨勬槸鈥滄柊鎺ュ叆鏂囧浘鐢熻棰戝悗鏆撮湶鍑虹殑浠撳簱绾х被鍨�/娴嬭瘯鑰﹀悎鐐光€濓紝涓嶆槸鏂板闇€姹傛墿鏁ｏ細
  - `video-remix` 琛ㄥ崟瀛楁婕旇繘鍚庯紝鏃ф祴璇曟病鏈夊悓姝�
  - `Segmented` 鏁板瓧鍊间笌缁勪欢娉涘瀷鎺ㄦ柇涓嶄竴鑷�
  - `react-query` 鐨� `mutationFn` 涓嶈兘鐩存帴寮曠敤甯﹂澶栧弬鏁扮殑 API 灏佽鍑芥暟
  - 椤甸潰闆嗘垚娴嬭瘯缂哄皯 `Router + QueryClient` 涓婁笅鏂�
- 鏋勫缓杈撳嚭閲屼粛鏈変竴鏉￠潪闃绘柇 warning锛�
  - `Circular chunk: vendor -> react-vendor -> vendor`
  - 杩欏睘浜庣幇鏈� `vite` 鎵嬪姩鍒嗗寘绛栫暐鐨勪紭鍖栭」锛屼笉褰卞搷鏈浠诲姟浜や粯

### 閬楃暀涓庝笅涓€姝�
1. `openspec/changes/add-text-image-video-task-flow/tasks.md` 杩樺墿锛�
   - `5.4`锛氭槸鍚﹁ˉ `TaskRecordsPage` 娣遍摼鍏ュ彛
   - `6.5`锛氭槸鍚﹀仛涓€娆＄湡瀹炴祻瑙堝櫒鎵嬪伐涓婚摼璺獙璇�
2. 濡傛灉浣犲笇鏈涙垜缁х画鎶婅繖涓� change 鏀跺埌鏇村畬鏁达紝鎴戜笅涓€姝ュ缓璁厛鍋氾細
   - `TaskRecordsPage` 鍒� `/image-video/tasks` 鐨勬渶灏忓洖璺冲叆鍙�
   - 鍐嶅仛涓€娆℃祻瑙堝櫒涓婚摼璺墜楠屽苟琛ユ枃妗�

## 2026-06-23 鏂囧浘鐢熻棰戝疄鐜扮鍥涢樁娈碉細浠诲姟璁板綍鍏ュ彛琛ラ綈涓庢祻瑙堝櫒鎵嬮獙

### 宸插畬鎴�
- 宸蹭负 `TaskRecordsPage` 琛ラ綈鏈€灏忕湡瀹炲洖璺冲叆鍙ｏ細
  - 椤甸潰锛歚src/pages/TaskRecordsPage.tsx`
  - 娴嬭瘯锛歚src/pages/TaskRecordsPage.test.tsx`
- 宸查獙璇佷换鍔¤褰曢〉鎸夐挳鍙烦杞埌鐪熷疄鏂囧浘鐢熻棰戜换鍔″垪琛ㄩ〉锛�
  - `/tasks -> /image-video/tasks`
- 宸插惎鍔ㄦ湰鍦板墠绔紑鍙戞湇鍔″苟浣跨敤娴忚鍣ㄦ墜宸ユ鏌ヤ互涓嬭矾鐢憋細
  - `/image-video`
  - `/image-video/tasks`
  - `/tasks`
- 宸茬‘璁ゅ墠绔矾鐢辨帴鍏ヤ笌椤甸潰澹冲眰灞曠ず姝ｅ父锛屾枃鍥剧敓瑙嗛鍒涘缓椤点€佸垪琛ㄩ〉鍜屼换鍔¤褰曢〉鍏ュ彛閮借兘姝ｇ‘杩涘叆銆�

### 褰撳墠鍒ゆ柇
- `5.4` 宸叉寜鏈€灏忚寖鍥撮棴鍚堬細褰撳墠涓嶆槸鎶� `TaskRecordsPage` 閲嶆瀯涓虹湡瀹炰换鍔′腑蹇冿紝鑰屾槸鍏堜繚璇佺敤鎴疯兘浠庝换鍔¤褰曢〉鍥炲埌鐪熷疄鏂囧浘鐢熻棰戜换鍔￠〉銆�
- 娴忚鍣ㄦ墜楠屾樉绀猴紝鍓嶇涓婚摼璺凡缁忛€氬埌鈥滈〉闈㈣矾鐢� + 鍏ュ彛璺宠浆鈥濊繖涓€灞傦紝浣嗙湡瀹炴帴鍙ｈ仈璋冧粛鍙楀綋鍓嶅紑鍙戠幆澧冮檺鍒讹細
  - 瀹為檯璇锋眰鍦板潃锛歚/api-api/api/v1/customer/text-image-video/tasks`
  - 娴忚鍣ㄧ綉缁滅粨鏋滐細`401 Unauthorized`
- 杩欒鏄庢湰娆� `6.5` 鐨勬墜宸ラ獙璇佸凡瀹屾垚鈥滃墠绔彲杈炬€т笌璺宠浆楠岃瘉鈥濓紝浣嗘湭瀹屾垚鈥滅湡瀹炲垱寤� -> 鏌ョ湅璇︽儏 -> 鍒犻櫎鈥濈殑瀹屾暣绔埌绔獙鏀讹紝闃诲鐐逛笉鏄墠绔矾鐢遍€昏緫锛岃€屾槸褰撳墠璁よ瘉/鑱旇皟鐜涓嶅彲鐢ㄣ€�

### 閬楃暀涓庝笅涓€姝�
1. 濡傛灉瑕佸畬鎴愮湡瀹炵鍒扮鎵嬮獙锛岄渶瑕佷綘鎻愪緵鑷冲皯涓€绉嶅彲鐢ㄨ仈璋冩潯浠讹細
   - 鍙櫥褰曠殑娴嬭瘯璐﹀彿
   - 姝ｇ‘鐨� `VITE_APP_BASE_API`
   - 鎴栧彲澶嶇敤鐨勬湰鍦伴壌鏉� token
2. 鎷垮埌鐪熷疄鑱旇皟鏉′欢鍚庯紝涓嬩竴姝ユ垜鍙互鐩存帴琛ュ畬锛�
   - 鍒涘缓浠诲姟
   - 鎵撳紑璇︽儏
   - 杩斿洖鍒楄〃
   - 鍒犻櫎浠诲姟
3. 褰撳墠闈為樆鏂妧鏈仐鐣欒繕鏈変竴鏉℃瀯寤� warning锛�
   - `Circular chunk: vendor -> react-vendor -> vendor`
   - 灞炰簬 `vite` 鎵嬪姩鍒嗗寘浼樺寲椤癸紝涓嶅奖鍝嶆湰娆′氦浠�

## 2026-06-23 鏂囧浘鐢熻棰戣仈璋冭ˉ鍏咃細浠ｇ悊閾捐矾纭

### 宸插畬鎴�
- 宸插鏍稿綋鍓嶆湰鍦拌仈璋冮厤缃細
  - `.env.development` 涓� `VITE_APP_BASE_API='/api-api'`
  - `vite.config.ts` 宸查厤缃� `/api-api -> http://192.168.110.145:8000` 鍙嶅悜浠ｇ悊锛屽苟浼氬湪杞彂鍓嶅幓鎺� `/api-api`
- 宸查€氳繃娴忚鍣ㄧ綉缁滈潰鏉跨‘璁ら獙璇佺爜鎺ュ彛宸茶蛋鍒扮湡瀹炲悗绔細
  - `GET /api-api/api/v1/customer/auth/captcha`
  - 杩斿洖缁撴灉锛歚200 OK`
- 宸茬‘璁ゆ鍓嶆枃鍥剧敓瑙嗛浠诲姟鍒楄〃椤电殑 `401` 涓嶅啀鏄€滀唬鐞嗘湭鐢熸晥鈥濓紝鑰屾槸鈥滄湭鐧诲綍鐘舵€佽闂彈淇濇姢鎺ュ彛鈥濈殑姝ｅ父閴存潈缁撴灉銆�

### 褰撳墠鍒ゆ柇
- 鐜板湪鍓嶇鍒板悗绔殑缃戠粶閾捐矾宸茬粡閫氫簡锛岄棶棰樿竟鐣屽凡缁忎粠鈥滀唬鐞�/璺ㄥ煙灞傗€濇敹鏁涘埌鈥滆璇佸嚟璇佸眰鈥濄€�
- 涔熷氨鏄锛屾枃鍥剧敓瑙嗛鐪熷疄鎺ュ彛璇锋眰宸茬粡鑳藉埌鍚庣锛屽彧宸竴涓湁鏁堢櫥褰曟€侊紝灏卞彲浠ョ户缁畬鎴愶細
  - 鍒涘缓浠诲姟
  - 鏌ョ湅璇︽儏
  - 杩斿洖鍒楄〃
  - 鍒犻櫎浠诲姟

### 閬楃暀涓庝笅涓€姝�
1. 缁х画鐪熷疄鑱旇皟鍙樊涓€涓彲鐢ㄦ祴璇曡处鍙凤紝鎴栫幇鎴� access token / refresh token銆�
2. 涓€鏃︽嬁鍒拌处鍙凤紝鎴戜細鐩存帴缁х画娴忚鍣ㄤ富閾捐矾鎵嬮獙锛屽苟鎶婃渶缁堢粨鏋滆ˉ鍥� `openspec` 涓� `doc/progress.md`銆�
## 2026-06-23 文图生成视频页面还原修复

### 已完成
- 已针对“图文生成视频页面不够还原”的问题完成根因排查，并确认问题不是单纯样式偏差，而是：
  - 页面和共享布局存在历史中文乱码
  - `ImageVideoPage` 缺少 Figma 关键结构区块
- 已重写 `src/pages/ImageVideoPage.tsx`，在保留真实任务创建链路的前提下补齐设计结构：
  - 输入方式
  - 视频主题
  - 输入文案
  - 图片上传
  - 视频风格
  - 输出方式卡片
  - 自动配音 / 自动字幕 / 添加 BGM
  - 右侧视频预览三态
- 已修复 `src/app/layouts/DashboardLayout.tsx` 的共享乱码文案：
  - 品牌名
  - 副标题
  - 通知按钮
  - 折叠按钮
  - 用户文案
- 已同步更新回归测试：
  - `src/pages/ImageVideoPage.test.tsx`
  - `src/app/layouts/DashboardLayout.test.tsx`
- 已新增专项进展文档：
  - `doc/2026-06-23-image-video-restore-progress.md`

### 当前判断
- 这轮修复的重点是“补页面契约”，不是只调 CSS。
- 当前页面已经从“只有基础创建表单”提升为“更接近 Figma 的完整创作页”，同时没有破坏现有 `createTextImageVideoTask` 的真实跳转链路。
- 右侧预览区目前采用的是“创建前 / 创建中 / 创建成功反馈”的过渡方案，没有伪造真实成片结果，这样更符合当前真实业务状态。

### 验证结果
- 已执行：
  - `npm test -- src/pages/ImageVideoPage.test.tsx src/app/layouts/DashboardLayout.test.tsx`
  - 结果：通过，`2 passed, 5 tests passed`
- 已执行：
  - `npm run build`
  - 结果：通过
- 当前仅剩历史 warning：
  - `Circular chunk: vendor -> react-vendor -> vendor`
  - 不阻塞本次页面还原交付

### 下一步
1. 如果继续追求 1:1 还原，建议下一轮直接做浏览器截图对照，微调：
   - 分栏比例
   - 卡片阴影
   - 选中态颜色
   - 右侧预览高度与留白
2. 如果你希望，我下一步可以继续把 `ProductVideoPage` 和 `ViralRemixPage` 也按同样标准做一轮 Figma 还原清理。
## 2026-06-23 文图生视频详情页菜单归属修复

### 已完成
- 已确认问题根因不在侧边栏组件本身，而在 `App.tsx` 的隐藏路由高亮策略：
  - 之前隐藏详情页统一回退到“第一个可见菜单”
  - 所以 `/image-video/tasks/:taskId` 会错误高亮到“工作台”
- 已为隐藏详情路由补充显式父菜单映射：
  - `content.imageVideoTaskDetail -> content.imageVideoTasks`
  - `content.viralRemixTaskDetail -> content.viralRemixTasks`
  - `content.digitalHumanDetail -> content.digitalHumans`
  - `content.digitalHumanVideoTaskDetail -> content.digitalHumanVideoTasks`
- 已在 `src/app/router/routeTypes.ts` 中为路由元信息增加 `activeMenuKey`
- 已在 `src/app/App.tsx` 中新增隐藏路由的父菜单解析逻辑，替代原先“默认回第一个可见菜单”的兜底策略
- 已同步补充回归测试：
  - `src/app/App.test.tsx`
  - `src/app/router/routeRegistry.tsx`

### 当前判断
- 现在“文图生视频详情”虽然仍是隐藏页，但会正确归属到“文图生视频任务”目录高亮，符合“任务目录下一级并隐藏”的语义。
- 这次修复不是给单一路径打补丁，而是给整个路由系统补了一层“隐藏详情页归属父菜单”的能力，后续追爆任务、数字人详情也会一起受益。

### 验证结果
- 已执行：
  - `npm test -- src/app/App.test.tsx src/app/router/routeRegistry.test.ts`
  - 结果：通过，`2 passed, 13 tests passed`

## 2026-06-24 鍚堝苟 `codex/upload-unified-experience` 鍒� `main`

### 宸插畬鎴�
- 宸叉寜鍚堝苟鍓嶆鏌ユ祦绋嬬‘璁ゅ綋鍓嶅垎鏀负 `main`锛岀洰鏍囧垎鏀负 `codex/upload-unified-experience`銆�
- 宸茬敤 `git stash push --include-untracked -m "codex-before-merge-upload-unified-experience"` 涓存椂淇濆瓨鍚堝苟鍓嶆湰鍦版敼鍔細
  - `.gitignore`
  - `doc/progress.md`
- 宸茬‘璁ゅ悎骞堕樆濉炵偣鏄湰鍦� `tmp-dev-server.log` 琚鍦ㄨ繍琛岀殑 Vite 寮€鍙戞湇鍔″崰鐢ㄣ€�
- 宸插仠姝㈡湰浠撳簱瀵瑰簲鐨勬湰鍦板紑鍙戞湇鍔¤繘绋嬶紝闅忓悗鎶婂師鏈殑鏈湴鏃ュ織鏀瑰悕涓猴細
  - `tmp-dev-server.log.local-backup`
- 宸叉墽琛屽揩杩涘悎骞讹細
  - `git merge --ff-only codex/upload-unified-experience`
- 鍚堝苟缁撴灉涓� Fast-forward锛宍main` 宸叉洿鏂板埌锛�
  - `3530d76 feat: unify upload detail experience and restore workspace routes`

### 褰撳墠鍒ゆ柇
- 鏈鍚堝苟娌℃湁浠ｇ爜鍐茬獊锛屽睘浜庡彲蹇繘鍚堝苟銆�
- 鐩爣鍒嗘敮鏈韩鏂板骞惰窡韪簡 `tmp-dev-server.log` 鍜� `tmp/` 涓嬬殑鎴浘鏂囦欢锛屾墍浠ユ鍓嶅崟鐙湪 `.gitignore` 閲屽拷鐣� `tmp-dev-server.log` 宸蹭笉鍐嶈兘瑙ｅ喅璇ユ枃浠剁殑鐗堟湰绠＄悊闂銆�
- 褰撳墠浠嶄繚鐣欐湰鍦板浠芥枃浠� `tmp-dev-server.log.local-backup`锛屾湭鍒犻櫎浠讳綍纾佺洏鍐呭銆�
- 鍚堝苟鍓� stash 浠嶄繚鐣欙紝鍙綔涓哄洖鏌ユ湰鍦板悎骞跺墠璁板綍鐨勪繚闄┿€�

### 涓嬩竴姝�
1. 杩愯鍚堝苟鍚庣殑绫诲瀷妫€鏌ヤ笌鍏抽敭娴嬭瘯锛岀‘璁や富绾跨姸鎬併€�
2. 鏍规嵁楠岃瘉缁撴灉鍐冲畾鏄惁闇€瑕佹帹閫� `main`銆�
3. 鑻ュ悗缁‘璁ゅ浠芥棩蹇椾笉鍐嶉渶瑕侊紝鍐嶇敱鐢ㄦ埛纭鏄惁娓呯悊銆�

### 楠岃瘉缁撴灉
- 宸叉墽琛岋細
  - `npm run typecheck`
  - 缁撴灉锛氶€氳繃銆�
- 宸叉墽琛岋細
  - `npm test -- src/pages/ImageVideoPage.test.tsx src/pages/upload-integration.test.tsx src/pages/TextImageVideoTaskDetailPage.test.tsx src/pages/DigitalHumanVideoTaskDetailPage.test.tsx src/app/router/routeRegistry.test.ts src/app/router/routeGuards.test.ts src/app/router/dynamicRoutes.test.ts src/app/App.test.tsx`
  - 缁撴灉锛氶€氳繃锛宍8` 涓祴璇曟枃浠躲€乣47` 涓祴璇曞叏閮ㄩ€氳繃銆�

### 鏀跺熬鐘舵€�
- 褰撳墠 `main` 宸查鍏� `origin/main` 涓や釜鎻愪氦銆�
- 褰撳墠鏈彁浜ゆ敼鍔ㄥ彧鏈夋湰娆¤拷鍔犵殑 `doc/progress.md` 璁板綍锛屼互鍙婃湭璺熻釜澶囦唤鏂囦欢 `tmp-dev-server.log.local-backup`銆�
- `stash@{0}` 浠嶄繚鐣欏悎骞跺墠鏈湴鏀瑰姩蹇収锛屾殏鏈垹闄ゃ€�

## 2026-06-27 追爆任务上传组件与 antd-vendor 优化收口

### 已完成
- 已完成 `VideoRemixTaskDetailPage` 上传交互收口，四类素材上传入口统一走组件化上传交互。
- 详情页当前通过 `antd Upload` 封装的 `UploadTrigger` 处理：参考视频、商品图、人物图、音频上传。
- 已补齐并修正上传回归测试，测试现在直接命中 `Upload` 组件内部文件输入，避免继续依赖原生 input 外层容器行为。
- 已补充 `manualChunks` 单测，并重新验证分包规则。

### 这轮对 `antd-vendor` 的判断
- `antd-vendor` 大不是单点 bug，更像依赖结构结果。
- 本轮实测发现，把 `antd / @ant-design / rc-* / icons` 强拆成多个 vendor chunk，会引入循环 chunk 警告，不适合当前项目直接上线。
- 当前收敛后的稳定策略是：
  - `react / react-dom / react-router / scheduler` 单独进 `react-vendor`
  - `lucide-react` 单独进 `icon-vendor`
  - `antd / @ant-design / @rc-component / rc-*` 统一进 `antd-vendor`
- 这比“硬拆更多 vendor 包”更稳，原因是这几个包运行时耦合深，错误拆边界会形成 chunk 环依赖。

### 验证结果
- 已执行：`npx vitest run -c vitest.video-remix-regression.config.ts`
  - 结果：通过，`9 passed, 53 tests passed`
- 已执行：`npm run typecheck`
  - 结果：通过
- 已执行：`npm run build`
  - 结果：通过
- 当前构建剩余的是体积 warning，不再有本轮细拆方案带来的循环 chunk warning。

### 下一步建议
1. 如果继续优化首包，优先做页面级懒加载和重型页面分段加载。
2. 如果继续统一上传体验，下一轮可以把 `ViralRemixPage.tsx` 里残留的上传交互再做一次组件化清理。

## 2026-06-27 追爆任务详情页第二轮优化方案评估

### 已完成
- 已对齐用户新增的 5 个优化点，并完成当前代码现状扫描：
  - `src/pages/VideoRemixTaskDetailPage.tsx`
  - `src/pages/VideoRemixTasksPage.tsx`
  - `src/features/video-remix/form.ts`
- 已输出独立方案文档：
  - `doc/2026-06-27-video-remix-optimization-plan.md`

### 当前判断
- 本轮更适合采用“在现有三步详情页上增强优化”的方案，而不是直接进入“编辑态 / 成品态”双模式重构。
- 当前最值得先做的四个落地点是：
  1. 下一步前先保存表单
  2. 参考视频改为标准比例预览
  3. 商品图 / 人物图改为更强的组件化素材展示
  4. 底部操作区改为悬浮 sticky 布局
- 列表页“查看成品”建议同步优化，但“已生成视频再次进入详情页默认展示态”这块先不并入本轮主实现。

### 下一步
1. 等用户确认方案后，直接按方案文档进入实现。
2. 实现顺序建议：步骤保存链路 -> 视频预览比例 -> 素材卡片展示 -> 列表成品入口优化。

---

## 2026-07-03 OpenSpec 褰掓。涓庢棫浠诲姟淇鍒ゆ柇

### 宸插畬鎴�
- 宸叉壂鎻� `openspec/changes` 涓嬬殑 7 涓椿鍔� change锛屽苟鎸� `tasks.md` 鍕鹃€夌姸鎬佸垵姝ュ垽鏂綊妗ｅ€欓€夈€�
- 宸茬‘璁ゅ綋鍓嶇幆澧冧腑 `openspec` CLI 涓嶅湪 PATH锛屾棤娉曟墽琛� `openspec list --json` 涓� `openspec status --change ... --json`锛屾湰娆″垽鏂互鏂囦欢鐘舵€佸拰褰撳墠浠ｇ爜瀹炵幇涓轰緷鎹€�
- 宸插鐓у綋鍓� Vite + React + TypeScript 浠ｇ爜缁撴瀯锛屾牳瀵硅矾鐢便€佸姩鎬佽彍鍗曘€佽拷鐖嗕换鍔°€佹枃鍥剧敓瑙嗛銆佹暟瀛椾汉绠＄悊鐩稿叧椤甸潰銆丄PI銆乫eature 灞備笌娴嬭瘯鏂囦欢銆�

### 鍙綊妗ｅ€欓€�
- `add-figma-ui-shell-pages`锛歚tasks.md` 鍏ㄩ儴瀹屾垚锛屼唬鐮佷腑宸插瓨鍦ㄥ熀纭€搴旂敤澹炽€佸姩鎬佽矾鐢辩浉鍏虫祴璇曞拰椤甸潰缁撴瀯锛屽彲浣滀负浼樺厛褰掓。鍊欓€夈€�
- `add-text-image-video-task-flow`锛歚tasks.md` 鍏ㄩ儴瀹屾垚锛屼唬鐮佷腑宸插瓨鍦ㄦ枃鍥剧敓瑙嗛 API銆乫eature銆佸垪琛ㄩ〉銆佽鎯呴〉鍜屾祴璇曪紝鍙綔涓轰紭鍏堝綊妗ｅ€欓€夈€�
- `connect-dynamic-menu-routes`锛歚tasks.md` 浠嶆湁澶ч噺鏈嬀閫夛紝浣嗗綋鍓嶄唬鐮佸凡瀹炵幇 `buildDynamicRouteState`銆乣useCurrentUserRoutes`銆丄pp 鍒濆鍖栨帴鍏ャ€�403/404銆佺櫥褰� redirect銆佸姩鎬佽矾鐢辨祴璇曠瓑鏍稿績鑳藉姏锛涘缓璁厛淇浠诲姟鍕鹃€変笌鎻忚堪锛屽啀鑰冭檻褰掓。銆�

### 涓嶅缓璁洿鎺ュ綊妗�
- `add-account-system-react-pages`锛�29 涓换鍔℃湭瀹屾垚锛屼笖褰撳墠浠ｇ爜涓昏鏄笟鍔＄敓浜у钩鍙伴〉闈紝涓嶆槸璐﹀彿浣撶郴瀹屾暣椤甸潰锛屽缓璁繚鐣欐垨閲嶆柊璇勪及鑼冨洿銆�
- `add-digital-human-management-flow`锛氬墿浣� `npm test` 涓庢墜宸ヤ富閾捐矾楠岃瘉鏈嬀閫夛紝浠ｇ爜瀹炵幇鍩烘湰瀛樺湪锛屼絾搴旇ˉ楠岃瘉璁板綍鍚庡啀褰掓。銆�
- `add-video-remix-task-flow`锛氬ぇ閮ㄥ垎瀹屾垚锛屼粎鍓┾€滄槸鍚﹂渶瑕佸眬閮ㄧ粍浠�/hooks鈥濆拰鎵嬪伐涓婚摼璺獙璇侊紱鍏朵腑 3.3 鏇村儚鏉′欢鎬т换鍔★紝寤鸿鏀规垚鈥滄棤闇€鏂板 shared 鎶借薄锛屼繚鐣欓〉闈㈠眬閮ㄥ疄鐜扳€濆苟鍕鹃€夛紝鎵嬪伐楠岃瘉鍚庡彲褰掓。銆�
- `redesign-video-remix-step-flow`锛氬綋鍓嶄唬鐮佸凡鍑虹幇 `Steps/currentStep/generatedPrompt/progress` 绛変笁姝ユ祦璇佹嵁锛岃鏄庡疄鐜拌繘搴﹂珮浜庝换鍔″嬀閫夛紱浣嗕换鍔℃枃浠朵粛鏈� 21 椤规湭鍕鹃€夛紝寤鸿鍏堢郴缁熸洿鏂颁换鍔＄姸鎬侊紝涓嶅缓璁幇鍦ㄥ綊妗ｃ€�

### 闇€瑕佷慨鏀圭殑鏃т换鍔�
- `connect-dynamic-menu-routes`锛氫换鍔＄姸鎬佹槑鏄捐惤鍚庝簬浠ｇ爜锛屽簲鎶婂凡瀹炵幇鐨勫姩鎬佽矾鐢辫浆鎹㈠櫒銆佸閾捐瘑鍒€侀殣钘忚彍鍗曘€丄pp 鎺ュ叆銆佺櫥褰� redirect銆�403/404 鍜岀浉鍏虫祴璇曟敼涓哄凡瀹屾垚锛涘墿浣欏彧淇濈暀纭疄鏈獙璇佹垨鏈畬鎴愮殑椤广€�
- `redesign-video-remix-step-flow`锛氫换鍔＄姸鎬佹槑鏄捐惤鍚庝簬浠ｇ爜锛屽簲閲嶆柊鏍稿 `VideoRemixTaskDetailPage.tsx`銆乣features/video-remix/*` 鍜屽搴旀祴璇曪紝鎶婁笁姝ュ鑸€佹彁绀鸿瘝缂栬緫銆佽繘搴﹀弽棣堛€佽棰戝姣旂瓑宸插疄鐜伴」鍕鹃€夛紱鑻ヤ粛鏈� UI 缁嗚妭宸紓锛屽啀鎷嗘垚鏇村皬鐨勮ˉ鍏呬换鍔°€�
- `add-video-remix-task-flow`锛�3.3 鏄潯浠舵€т换鍔★紝涓嶅簲闀挎湡鍗″綊妗ｏ紱鑻ュ綋鍓嶉〉闈㈠眬閮ㄥ疄鐜板凡缁忚冻澶燂紝搴旀敼鍐欎负鈥滅粡璇勪及鏃犻渶鏂板 shared 鎶借薄鈥濓紝骞跺嬀閫夈€�
- 鎵€鏈� change 鐨勫綊妗ｅ墠閮藉缓璁厛琛ヤ富瑙勬牸鐩綍鎴栫‘璁ゆ槸鍚︿笉闇€瑕� sync锛涘綋鍓嶄粨搴撴病鏈� `openspec/specs` 涓昏鏍肩洰褰曪紝褰掓。鏃惰鏄庣‘鈥滀粎褰掓。鍙樻洿锛屼笉鍚屾涓昏鏍尖€濊繕鏄厛琛ラ綈涓昏鏍笺€�

### 涓嬩竴姝�
1. 鍏堜慨姝� `connect-dynamic-menu-routes` 涓� `redesign-video-remix-step-flow` 鐨� `tasks.md` 鍕鹃€夌姸鎬併€�
2. 瀵� `add-figma-ui-shell-pages` 涓� `add-text-image-video-task-flow` 鍋氬綊妗ｅ墠纭銆�
3. 濡傞渶鐪熷疄褰掓。锛屽厛璁╃敤鎴风‘璁ゅ叿浣� change 鍚嶇О锛涘綊妗ｄ細绉诲姩鐩綍鍒� `openspec/changes/archive/YYYY-MM-DD-<change-name>`锛屾湰娆℃病鏈夋墽琛岀Щ鍔ㄦ垨鍒犻櫎銆�
---

## 2026-07-03 OpenSpec 褰撳墠鏈畬鎴愪换鍔℃竻鍗�

褰撳墠 OpenSpec 鏈畬鎴愪换鍔℃竻鍗�

- add-account-system-react-pages: 宸插畬鎴� 0锛屾湭瀹屾垚 29
  - [ ] 1.1 Confirm React scaffold choice: Vite + React + TypeScript is the default unless the team requests Next.js or another framework.
  - [ ] 1.2 Initialize the frontend project structure and keep source code under a clear app directory.
  - [ ] 1.3 Add routing, linting, formatting, and TypeScript configuration.
  - [ ] 1.4 Define environment configuration for Mock API and future backend API base URL.
  - [ ] 2.1 Use Figma MCP to scan the provided account-system page nodes.
  - [ ] 2.2 Map Figma frames to the PRD page list: login/register, phone binding, profile, real-name auth, enterprise certification, enterprise workspace, members, points usage, agreement signing, permission modal.
  - [ ] 2.3 Identify missing Figma pages and create implementation placeholders using the same design system style.
  - [ ] 2.4 Extract reusable UI patterns: form layout, verification-code input, upload field, status badge, table, modal, empty state, and workspace summary card.
  - [ ] 3.1 Create TypeScript types for user, account status, real-name auth, enterprise, enterprise member, points account, agreement, permission result, and operation log context.
  - [ ] 3.2 Implement a centralized API Client interface for auth, account profile, real-name auth, enterprise application, enterprise members, points usage, and agreement signing.
  - [ ] 3.3 Add Mock API data that covers personal user, real-name user, enterprise admin, creator, observer, unbound WeChat user, frozen user, and rejected certification states.
  - [ ] 3.4 Add a small permission utility that evaluates identity, role, certification, account status, points status, and agreement status.
  - [ ] 4.1 Implement phone/password login, phone/SMS login, registration, and password reset pages.
  - [ ] 4.2 Implement WeChat phone-binding page for PC scan and mini-program authorization result states.
  - [ ] 4.3 Implement personal center page with phone, WeChat binding, identity type, account status, certification status, enterprise status, and agreement records.
  - [ ] 4.4 Implement real-name authentication page with submission, pending, approved, rejected, and frozen states.
  - [ ] 5.1 Implement enterprise certification application page with required fields, upload placeholders, contact phone verification, and agreement confirmation.
  - [ ] 5.2 Implement enterprise workspace home with enterprise information, points balance, member count, recent tasks, material entry, digital-human entry, and usage entry.
  - [ ] 5.3 Implement member management page with create member, role assignment, stop member, and role-limited access states.
  - [ ] 5.4 Implement points usage page with balance summary, member usage records, task/function type, cost, result status, refund status, and time filters.
  - [ ] 6.1 Implement agreement signing modal/page for registration, first AI generation, enterprise certification, high-risk閻喍姹夌槐鐘虫綏, and digital-human scenes.
  - [ ] 6.2 Implement permission interception modal for閺堫亜鐤勯崥宥冣偓浣规弓缁涘墽璁查妴浣风磼娑撴碍婀拋銈堢槈閵嗕浇顫楅懝鍙夋￥閺夊啴妾洪妴浣藉閸欏嘲鍠曠紒鎾扁偓渚€顥撻幒褔妾洪崚?and points unavailable states.
  - [ ] 6.3 Ensure high-risk features display the required guidance copy from the PRD.
  - [ ] 6.4 Ensure sensitive information such as ID card number is masked in all user-facing displays.
  - [ ] 7.1 Run TypeScript checks and linting.
  - [ ] 7.2 Run unit tests for permission utility and API Client mock state transitions.
  - [ ] 7.3 Use browser verification to test login, WeChat binding, real-name submission, enterprise certification, member management, points usage, agreement signing, and permission interception flows.
  - [ ] 7.4 Compare implemented pages against Figma MCP screenshots and fix layout mismatches.
  - [ ] 7.5 Run `openspec status --change add-account-system-react-pages` and confirm the change is apply-ready.

- add-digital-human-management-flow: 宸插畬鎴� 28锛屾湭瀹屾垚 2
  - [ ] 7.3 鏉╂劘顢� `npm test`
  - [ ] 7.5 閹靛浼愭宀冪槈閳ユ粌鍨悰銊︾叀鐠�?-> 閸掓稑缂撻弫鏉跨摟娴�?-> 閺屻儳婀呯拠锔藉剰 -> 閸掗攱鏌婇悩鑸碘偓?-> 閸掔娀娅庨弫鏉跨摟娴滆　鈧繀瀵岄柧鎹愮熅

- add-figma-ui-shell-pages: 宸插畬鎴� 41锛屾湭瀹屾垚 0

- add-text-image-video-task-flow: 宸插畬鎴� 24锛屾湭瀹屾垚 0

- add-video-remix-task-flow: 宸插畬鎴� 27锛屾湭瀹屾垚 2
  - [ ] 3.3 婵″倿銆夐棃銏㈢矋閸氬牆顦查弶鍌氬鏉╁洭鐝敍灞炬煀婢х偞娓剁亸蹇撶箑鐟曚胶娈戠仦鈧柈銊х矋娴犺埖鍨� hooks閿涘奔绲鹃柆鍨帳閹跺﹣绔村▎鈩冣偓褔銆夐棃銏犳健鏉╁洦妫幓鎰磳閸�?`shared`
  - [ ] 7.5 閹靛濮╂宀冪槈閳ユ粌鍨卞?-> 鐠囷附鍎� -> 娣囨繂鐡� -> 閻㈢喐鍨� -> 閸掗攱鏌� -> 閸ョ偟婀呴垾婵呭瘜闁炬崘鐭�

- connect-dynamic-menu-routes: 宸插畬鎴� 6锛屾湭瀹屾垚 0

- redesign-video-remix-step-flow: 宸插畬鎴� 4锛屾湭瀹屾垚 21
  - [ ] 2.1 鐠嬪啯鏆� `src/features/video-remix/form.ts`閿涘奔璐熼垾婊呯閺夋劒绗傛导鐘叉嫲闁板秶鐤嗛垾婵冣偓婊勫絹缁€楦跨槤閳ユ績鈧粏顫嬫０鎴犳晸閹存劏鈧繀绗佸銉╁櫢閺傜増鈷婇悶鍡楃摟濞堝灚妲х亸鍕珶閻�?
  - [ ] 2.2 娣囨繄鏆€閸愬懘鍎撮崶鍓у URL 閺傚洦婀伴弰鐘茬殸閸忕厧顔愰柅鏄忕帆閿涘奔绲剧粔濠氭珟 UI 鐎电懓鏅㈤崫浣告禈閵嗕椒姹夐悧鈺佹禈 URL 閻╁瓨甯存潏鎾冲弳閻ㄥ嫪绶风挧?
  - [ ] 2.3 閹碘晛鐫� `src/features/video-remix/status.ts`閿涘矁藟閸忓懏褰佺粈楦跨槤閻㈢喐鍨氶梼鑸殿唽閵嗕浇顫嬫０鎴犳晸閹存劙妯佸▓鐢垫畱閹稿鎸抽崣顖滄暏閹佲偓浣界箻鎼达箑鐫嶇粈鍝勬嫲婢惰精瑙﹂崣宥夘洯閸掋倖鏌�
  - [ ] 3.1 闁插秵鐎� `src/pages/VideoRemixTaskDetailPage.tsx`閿涘苯濮為崗銉ょ瑏濮濄儲绁︾粙瀣嚤閼割亜鑻熸禒銉┿€夐棃銏犵湰闁劎濮搁幀浣瑰付閸掕泛缍嬮崜宥嗩劄妤�?
  - [ ] 3.2 鐏忓棌鈧粎绀岄弶鎰瑐娴肩姴鎷伴柊宥囩枂閳ユ繃鏁兼稉铏诡儑娑撯偓娑擃亝顒炴銈忕礉鐠嬪啯鏆ｇ€涙顔屾い鍝勭碍娑撹　鈧粎绀岄弶鎰瑐娴肩姴婀崜宥忕礉閸愬懎顔愰弬鐟版倻閸︺劌鎮楅垾?
  - [ ] 3.3 閸︺劎绀岄弶鎰劄妤犮倓鑵戞稉琛♀偓婊冾槻閸掔粯鏌熼崥鎴斺偓婵嗩杻閸旂姴顦▔銊嚛閺勫函绱濋獮鏈佃礋閳ユ粈楠囬崫浣蜂繆閹垪鈧績鈧粌褰涢幘顓熸瀮濡楀牃鈧繂顤冮崝鐘偓娣嶪 閼奉亜濮╅悽鐔稿灇閳ユ繃瀵滈柦顔煎弳閸�?
  - [ ] 3.4 閸掔娀娅庣槐鐘虫綏濮濄儵顎冩稉顓犳畱閳ユ粏顫嬫０鎴炴喅鐟曚讲鈧繆绶崗銉ュ隘閿涘苯鑻熺亸鍡楁櫌閸濅礁娴橀妴浣锋眽閻椻晛娴樻禍銈勭鞍閺€閫涜礋閳ユ粈绗傛导?+ 妫板嫯顫� + 閸掔娀娅庨垾?
  - [ ] 3.5 缂傗晛鐨崣鍌濃偓鍐潒妫版垿顣╃憴鍫濈鐏炩偓閿涘苯宕伴悽銊︽纯鐏忔垿銆夐棃銏⑩敄闂傜繝绲炬穱婵堟殌妫板嫯顫嶉懗钘夊
  - [ ] 3.6 鐏忓棙褰佺粈楦跨槤閸栧搫鐓欓弨褰掆偓鐘冲灇閻欘剛鐝涘銉╊€冮敍灞界潔缁€鍝勭秼閸撳秵褰佺粈楦跨槤閵嗕焦鏁幐浣瑰閸斻劎绱潏鎴欌偓浣规暜閹镐浇袝閸欐垹鏁撻幋鎰絹缁€楦跨槤
  - [ ] 3.7 鐏忓棜顫嬫０鎴犳晸閹存劕灏崺鐔告暭闁姵鍨氶悪顒傜彌濮濄儵顎冮敍灞藉閸忋儱寮懓鍐潒妫版垳绗岄悽鐔稿灇鐟欏棝顣堕惃鍕嚠濮ｆ柨鐫嶇粈?
  - [ ] 3.8 閸︺劍褰佺粈楦跨槤閻㈢喐鍨氶妴浣筋潒妫版垹鏁撻幋鎰劄妤犮倓鑵戦崝鐘插弳濮濄儵顎冮崠鍝勫敶閻�?loading閵嗕浇绻樻惔锔芥蒋閵嗕胶濮搁幀浣规瀮濡楀牆鎷版径杈Е閸樼喎娲滅仦鏇犮仛
  - [ ] 4.1 娣囨繃瀵� `src/pages/VideoRemixTasksPage.tsx` 閻ㄥ嫧鈧粌鍨卞杞版崲閸斺€虫倵鏉╂稑鍙嗙拠锔藉剰妞ょ鈧繈鎽肩捄顖欑瑝閸欐﹫绱濊箛鍛邦洣閺冩儼鐨熼弫瀛樺絹缁€鐑樻瀮濡楀牅浜掗崠褰掑帳閺傜増顒炴銈嗙ウ
  - [ ] 4.2 閺嶇ǹ顕� `src/pages/ViralRemixPage.tsx` 閺勵垰鎯佹禒宥夋付娣囨繄鏆€娑撶儤妫崗銉ュ經妞ゅ灚鍨ㄥ鏇烆嚤妞ょ绱濋柆鍨帳娑撳骸缍嬮崜宥勫瘜闁炬崘鐭炬禍褏鏁撻崘鑼崐
  - [ ] 4.3 绾喛顓� `src/app/router/routeRegistry.tsx`閵嗕梗routeTypes.ts`閵嗕胶娴夐崗瀹犲綅閸楁洟鐝禍顕€鈧槒绶弮鐘绘付閺傛澘顤冪€涙劘鐭鹃悽鎲嬬礉娴犲懍绻氶幐浣哄箛閺堝鎹㈤崝鈥冲灙鐞涖劋绗岀拠锔藉剰鐠侯垳鏁遍崣顖滄暏
  - [ ] 5.1 閺囧瓨鏌� `src/pages/VideoRemixTaskDetailPage.test.tsx`閿涘矁顩惄鏍劄妤犮倕顕遍懜顏傗偓浣哥摟濞堢敻銆庢惔蹇嬧偓浣稿灩闂勩倛顫嬫０鎴炴喅鐟曚降鈧線娈ｉ挊?URL 鏉堟挸鍙嗛妴浣瑰絹缁€楦跨槤閸欘垳绱潏鎴欌偓浣界箻鎼达箑寮芥＃鍫濇嫲鐟欏棝顣剁€佃鐦�
  - [ ] 5.2 閺嶈宓佺€圭偤妾弨鐟板З閺囧瓨鏌� `src/pages/ViralRemixPage.test.tsx`閵嗕梗src/pages/VideoRemixTasksPage.test.tsx` 閹存牜娴夐崗瀹犵熅閻㈣鲸绁寸拠?
  - [ ] 5.3 閹笛嗩攽鏉╃晫鍨庢禒璇插閻╃ǹ鍙уù瀣槸閸涙垝鎶ら敍宀€鈥樼拋銈夈€夐棃顫瘜濞翠胶鈻奸崶鐐茬秺闁俺绻�
  - [ ] 5.4 閹笛嗩攽缁鐎峰Λ鈧弻銉﹀灗閺嬪嫬缂撻崨鎴掓姢閿涘瞼鈥樼拋銈嗘拱濞嗏剝鏁奸柅鐘虫弓閻潙娼栭悳鐗堟箒瀹搞儳鈻�
  - [ ] 6.1 鐎瑰本鍨氬В蹇庣鐏忓繘妯佸▓闈涙倵閺囧瓨鏌� `doc/progress.md`
  - [ ] 6.2 閸氬本顒為弴瀛樻煀 `doc/2026-06-27-video-remix-stepflow-progress.md`閿涘矁顔囪ぐ鏇熸拱濞�?OpenSpec 瀵よ櫣鐝涢妴浣规煙濡楀牆鍠呯粵鏍ф嫲閸氬海鐢婚幍褑顢戦悩鑸碘偓?
  - [ ] 6.3 閸︺劌鐤勯悳鏉跨暚閹存劕鎮楅敍宀兯夐崗鍛付缂佸牓鐛欑拠浣虹波閺嬫粈绗岄崜鈺€缍戞搴ㄦ珦鐠囧瓨妲�

---

## 2026-07-03 OpenSpec 鏈畬鎴愪换鍔℃竻鍗曡緭鍑�

### 宸插畬鎴�
- 宸叉寜褰撳墠 `openspec/changes/*/tasks.md` 鍐嶆鏁寸悊鏈畬鎴愪换鍔★紝骞跺悜鐢ㄦ埛杈撳嚭銆�
- 宸茬‘璁� `connect-dynamic-menu-routes/tasks.md` 瀛樺湪缂栫爜涓茶闂锛岀粺璁℃椂闇€浜哄伐绾犳锛屼笉鑳藉彧鐪嬭嚜鍔ㄥ嬀閫夋眹鎬汇€�

### 褰撳墠鍒ゆ柇
- 褰撳墠鏈畬鎴愪换鍔′富瑕侀泦涓湪 `add-account-system-react-pages`銆乣connect-dynamic-menu-routes`銆乣redesign-video-remix-step-flow`銆�
- `add-figma-ui-shell-pages` 涓� `add-text-image-video-task-flow` 宸叉棤鏈畬鎴愰」銆�
---

## 2026-07-03 OpenSpec 鎵归噺褰掓。鍓嶆鏌�

### 宸插畬鎴�
- 宸插畬鎴� `openspec/changes` 鎵归噺褰掓。鍓嶆鏌ワ紝鏈疆鏈墽琛屼换浣曠Щ鍔ㄦ搷浣溿€�
- 宸茬‘璁ゅ綋鍓嶄笉瀛樺湪 `openspec/changes/archive` 鐩綍銆�
- 宸茬‘璁や互涓� 7 涓� change 鎸� `2026-07-03-<change-name>` 鍛藉悕褰掓。鏃跺潎涓嶄細閲嶅悕銆�

### 褰撳墠鍒ゆ柇
- 鍙互鎵ц鎵归噺褰掓。娴佺▼锛屼絾杩欎細绉诲姩 change 鐩綍鍒� archive 涓嬨€�
- 褰撳墠鐜缂哄皯 `openspec` CLI锛屾棤娉曡蛋鏍囧噯 `openspec status` 褰掓。妫€鏌ワ紝鍙兘鍩轰簬鐜版湁鏂囦欢鐘舵€佹墽琛屽綊妗ｃ€�
- 褰撳墠浠撳簱涔熸病鏈� `openspec/specs` 涓昏鏍肩洰褰曪紝鍥犳鏈褰掓。鍙兘鍋氣€滅洰褰曞綊妗ｂ€濓紝涓嶄細鍋氫富瑙勬牸鍚屾銆�
---

## 2026-07-03 OpenSpec 鎵归噺褰掓。瀹屾垚

### 宸插畬鎴�
- 宸插垱寤� `openspec/changes/archive/`銆�
- 宸插皢浠ヤ笅 7 涓椿鍔� change 鎵归噺绉诲姩鍒板綊妗ｇ洰褰曪細
  - `2026-07-03-add-account-system-react-pages`
  - `2026-07-03-add-digital-human-management-flow`
  - `2026-07-03-add-figma-ui-shell-pages`
  - `2026-07-03-add-text-image-video-task-flow`
  - `2026-07-03-add-video-remix-task-flow`
  - `2026-07-03-connect-dynamic-menu-routes`
  - `2026-07-03-redesign-video-remix-step-flow`
- 宸插鏍� `openspec/changes`锛屽綋鍓嶆椿鍔ㄥ尯浠呭墿 `archive` 鐩綍銆�

### 褰撳墠鍒ゆ柇
- 鏈褰掓。鏄洰褰曠骇褰掓。锛屾湭鎵ц涓昏鏍煎悓姝ャ€�
- 鍘熷洜鏄綋鍓嶇幆澧冪己灏� `openspec` CLI锛屼笖浠撳簱鍐呬笉瀛樺湪 `openspec/specs` 涓昏鏍肩洰褰曘€�
- 鐢变簬閮ㄥ垎 change 鍘熸湰瀛樺湪鏈畬鎴愪换鍔★紝鏈褰掓。鏇村亸鍚戔€滃巻鍙叉敹鍙ｂ€濓紝閫傚悎鍚庣画鎸夐渶瑕侀噸鏂版彁鐐兼柊鐨� change锛岃€屼笉鏄户缁部鐢ㄦ棫 change 鐘舵€併€�
---

## 2026-07-03 OpenSpec 瑙﹀彂绾﹀畾鏁寸悊

### 宸插畬鎴�
- 宸叉暣鐞嗏€滅敤鎴峰浣曟槑纭姹傚厛璇嗗埆鍐嶅垱寤� OpenSpec 浠诲姟鈥濈殑鎺ㄨ崘璇濇湳銆�
- 宸插噯澶囧彲鐩存帴鏀惧叆 AGENTS.md 鐨勯暱鏈熺害瀹氭枃鏈€�

### 褰撳墠鍒ゆ柇
- 鏈€绋冲Ε鐨勬柟寮忔槸璁╃敤鎴峰湪闇€姹傞噷鏄庣‘澹版槑鈥滃厛璧� OpenSpec锛屽彧寤轰换鍔′笉鏀逛唬鐮佲€濇垨鍦� AGENTS.md 涓啓鎴愬浐瀹氳鍒欍€�
- 鑻ョ敤鎴峰笇鏈涢粯璁よ嚜鍔ㄥ缓 OpenSpec锛屽垯搴旀槑纭€滃摢浜涙儏鍐靛繀椤诲厛寤� change锛屽摢浜涙儏鍐靛厑璁哥洿鎺ユ敼浠ｇ爜鈥濄€�
---

## 2026-07-03 AGENTS.md 瑙勫垯钀藉湴

### 宸插畬鎴�
- 宸插湪浠撳簱鏍圭洰褰曟柊澧� `AGENTS.md`銆�
- 宸叉暣鐞嗗苟钀藉湴浠ヤ笅闀挎湡鍗忎綔瑙勫垯锛�
  - 绠€浣撲腑鏂囨矡閫�
  - 灏忛樁娈靛畬鎴愬悗鍚屾鏇存柊杩涘睍鏂囨。
  - 鍒犻櫎/楂橀闄╃鐩樻搷浣滃墠鍏堢‘璁�
  - 榛樿鍏堣皟鐮斿啀瀹炴柦
  - 鏂板姛鑳姐€侀噸鏋勩€佽法鏂囦欢鏀瑰姩浼樺厛鍏堣蛋 OpenSpec
  - 鏀跺埌鈥滃紑濮嬫墽琛屸€濆悗鍐嶆寮忔敼浠ｇ爜
- 宸插姞鍏ュ彲鐩存帴瑙﹀彂 OpenSpec 鐨勭敤鎴疯瘽鏈害瀹氥€�

### 褰撳墠鍒ゆ柇
- 鍚庣画浣犲彧瑕佹槑纭鈥滃厛璧� OpenSpec鈥濇垨鈥滃厛鍦� openspec 閲岀珛浠诲姟鈥濓紝灏辫兘绋冲畾瑙﹀彂鍏堝缓 change銆佸啀绛夌‘璁ゃ€佹渶鍚庢墽琛岀殑娴佺▼銆�
- 褰撳墠浠撳簱涔嬪墠娌℃湁瀹為檯钀藉湴鐨� `AGENTS.md`锛岀幇鍦ㄥ凡缁忚ˉ榻愪负浠撳簱绾ц鍒欏叆鍙ｃ€�
---

## 2026-07-03 OpenSpec 鐜鏍稿

### 宸插畬鎴�
- 宸叉鏌ュ綋鍓嶇幆澧冧腑鐨� `openspec` CLI 鏄惁鍙敤銆�
- 宸叉鏌ヤ粨搴撳唴鏄惁瀛樺湪 `openspec/specs` 涓昏鏍肩洰褰曘€�
- 宸茬‘璁や粨搴撲粎瀛樺湪 `openspec/config.yaml`銆乣openspec/project.md` 涓庡凡褰掓。鐨� `openspec/changes/archive/*`銆�

### 褰撳墠鍒ゆ柇
- 褰撳墠鐜閲� `openspec` CLI 澶ф鐜囨病鏈夊畨瑁咃紝鎴栬嚦灏戞病鏈夎繘鍏ュ綋鍓� shell 鐨� PATH銆�
- `openspec/specs` 缂哄け涓嶆槸 CLI 瀹夎闂锛岃€屾槸浠撳簱灞傞潰鐨勪富瑙勬牸鐩綍娌℃湁寤虹珛鎴栨病鏈夊悓姝ュ嚭鏉ャ€�
- 涔熷氨鏄锛氫竴涓槸鈥滃伐鍏风幆澧冮棶棰樷€濓紝涓€涓槸鈥滈」鐩粨鏋勫唴瀹归棶棰樷€濓紝涓嶈兘娣蜂负涓€绫汇€�
---

## 2026-07-03 OpenSpec CLI 淇涓庝富瑙勬牸鍩虹嚎寤虹珛

### 宸插畬鎴�
- 宸查€氳繃 `npm install -g @fission-ai/openspec@latest` 瀹夎 OpenSpec CLI銆�
- 宸茬‘璁ゅ綋鍓嶇幆澧冩弧瓒� OpenSpec 瑕佹眰鐨� Node 鐗堟湰锛屼笖 `openspec --version` 鍙甯歌緭鍑� `1.5.0`銆�
- 宸茬‘璁� `openspec list --json` 鍙互鍦ㄥ綋鍓嶄粨搴撴甯告墽琛屻€�
- 宸插垱寤� `openspec/specs/` 涓昏鏍肩洰褰曪紝骞惰ˉ榻愪互涓� 5 涓富瑙勬牸鑳藉姏锛�
  - `figma-ui-shell-pages`
  - `dynamic-menu-routes`
  - `text-image-video-task-flow`
  - `video-remix-task-flow`
  - `digital-human-management-flow`
- 宸叉墽琛� `openspec validate --specs --json --no-interactive`锛�5 涓� spec 鍏ㄩ儴鏍￠獙閫氳繃銆�

### 褰撳墠鍒ゆ柇
- 褰撳墠浠撳簱宸茬粡浠庘€滃彧鏈� changes/ 娌℃湁涓昏鏍尖€濈殑鐘舵€侊紝琛ラ綈涓衡€滃叿澶� CLI + 涓昏鏍煎熀绾库€濈殑鍙寔缁� OpenSpec 缁撴瀯銆�
- 鍚庣画鍐嶆柊澧為渶姹傛椂锛屽彲浠ョ洿鎺ュ厛寤� change锛屽苟鍦ㄩ渶瑕佸綊妗ｆ椂鎶婂彉鏇村悓姝ュ洖 `openspec/specs/`銆�
- 涔嬪墠褰掓。鐨� change 涓粛鏈夐儴鍒嗗唴瀹瑰彧鏄巻鍙叉柟妗堟垨鏈畬鍏ㄨ惤鍦板疄鐜帮紝鍥犳杩欐寤虹珛鐨勬槸鈥滃綋鍓嶆牳蹇冭兘鍔涗富瑙勬牸鍩虹嚎鈥濓紝涓嶆槸鏈烘澶嶅埗鍏ㄩ儴鏃� change 鐘舵€併€�

### 涓嬩竴姝�
1. 鍚庣画鏂伴渶姹傜洿鎺ユ寜鈥滃厛璧� OpenSpec鈥濆垱寤烘柊 change銆�
2. 瀵瑰皻鏈矇娣€涓昏鏍肩殑鑳藉姏锛堝鏁板瓧浜鸿棰戜换鍔°€佸畾鍒堕煶鑹茬瓑锛夊啀鎸夊疄闄呬唬鐮佹儏鍐甸€愭琛� specs銆�
3. 濡傞渶锛屾垜鍙互缁х画甯綘鎶婂巻鍙� archive 涓€煎緱淇濈暀鐨勮兘鍔涚户缁ˉ鎴愪富瑙勬牸銆�

### 楠岃瘉缁撴灉
- 宸叉墽琛岋細`openspec --version`
- 宸叉墽琛岋細`openspec list --json`
- 宸叉墽琛岋細`openspec list --specs`
- 宸叉墽琛岋細`openspec validate --specs --json --no-interactive`
- 缁撴灉锛�5 涓� specs 鍏ㄩ儴閫氳繃鏍￠獙銆�
---

## 2026-07-03 鐧诲綍寮哄埗淇敼瀵嗙爜 OpenSpec 浠诲姟鍒涘缓

### 宸插畬鎴�

- 宸叉寜闇€姹傚垱寤� OpenSpec change锛歚force-password-change-dialog-on-login`銆�
- 宸插畬鎴愪唬鐮佸簱涓婁笅鏂囨壂鎻忥紝纭椤圭洰涓� Vite + React + TypeScript + Ant Design + axios 璇锋眰灏佽銆�
- 宸茬‘璁ゅ綋鍓嶇櫥褰曠浉鍏虫枃浠讹細
  - `src/pages/LoginPage.tsx`
  - `src/pages/LoginPage.test.tsx`
  - `src/api/system/auth/index.ts`
  - `src/api/system/auth/types.ts`
  - `src/utils/request.ts`
- 宸插垱寤轰互涓� OpenSpec 鏂囨。锛�
  - `openspec/changes/force-password-change-dialog-on-login/proposal.md`
  - `openspec/changes/force-password-change-dialog-on-login/design.md`
  - `openspec/changes/force-password-change-dialog-on-login/specs/force-password-change-login/spec.md`
  - `openspec/changes/force-password-change-dialog-on-login/tasks.md`

### 褰撳墠鍒ゆ柇

- 鏈闇€姹傚睘浜庣櫥褰曞畨鍏ㄩ摼璺閲忥紝搴斿厛璧� OpenSpec锛屼笉鐩存帴鏀逛笟鍔′唬鐮併€�
- 鐜版湁浠ｇ爜宸茬粡瀛樺湪 `C10001` 棣栨鐧诲綍鏀瑰瘑闆忓舰锛屼絾涓庢柊闇€姹備粛鏈夊樊寮傦細
  - 褰撳墠鏇村儚鐧诲綍鍖哄潡鍒囨崲涓烘敼瀵嗚〃鍗曪紝鏂伴渶姹傝姹傚脊绐椼€�
  - 褰撳墠 API 璺緞鏄� `/auth/change-password`锛屾柊闇€姹傝姹� `/auth/password`銆�
  - 鏂伴渶姹傛槑纭姹傛敼瀵嗚姹傚甫 token銆�
  - 鏀瑰瘑鎴愬姛鍚庨渶瑕佹彁绀虹敤鎴烽噸鏂扮櫥褰曘€�

### 涓嬩竴姝�

1. 绛夌敤鎴风‘璁ゅ悗鎵ц `openspec/changes/force-password-change-dialog-on-login/tasks.md`銆�
2. 瀹炴柦鏃朵紭鍏堜慨鏀� API 灞傝矾寰勶紝鍐嶆敼鐧诲綍椤靛脊绐楃姸鎬侊紝鏈€鍚庤ˉ瀹氬悜娴嬭瘯銆�
3. 楠岃瘉閲嶇偣鏄� `C10001` 鍒嗘敮銆乣/auth/password` 璇锋眰浣撱€丄uthorization 澶淬€佹垚鍔熷悗娓呯悊鐧诲綍鎬佸拰閲嶆柊鐧诲綍鎻愮ず銆�

### 楠岃瘉缁撴灉

- 宸叉垚鍔熷垱寤� OpenSpec change銆�
- 灏氭湭淇敼涓氬姟浠ｇ爜銆�
- 灏氭湭杩愯瀹炵幇鐩稿叧娴嬭瘯锛岀瓑寰呯敤鎴风‘璁も€滃紑濮嬫墽琛屸€濆悗鍐嶈繘鍏ュ紑鍙戦獙璇併€�---

## 2026-07-03 涓汉涓績椤甸潰 OpenSpec 浠诲姟鍒涘缓

### 宸插畬鎴�

- 宸叉牴鎹敤鎴锋彁渚涚殑涓汉涓績鍙傝€冨浘鍒涘缓 OpenSpec change锛歚add-personal-center-page`銆�
- 宸插畬鎴愬綋鍓嶄唬鐮佸簱涓婁笅鏂囨壂鎻忥紝纭椤圭洰涓� Vite + React + TypeScript + Ant Design/TailwindCSS锛岃矾鐢遍噰鐢� `RouteKey` + `routeRegistry` 闈欐€佺粍浠舵槧灏勬ā寮忋€�
- 宸插垱寤轰互涓� OpenSpec 鏂囨。锛�
  - `openspec/changes/add-personal-center-page/proposal.md`
  - `openspec/changes/add-personal-center-page/design.md`
  - `openspec/changes/add-personal-center-page/specs/personal-center-page/spec.md`
  - `openspec/changes/add-personal-center-page/tasks.md`
- 宸插皢涓汉涓績椤甸潰浠诲姟鑼冨洿鎷嗕负锛氫釜浜鸿祫鏂欐瑙堛€佺Н鍒嗘瑙堛€佷娇鐢ㄧ粺璁°€佸畨鍏ㄤ笌鍋忓ソ銆佹帴鍙ｅ瓧娈甸鐣欍€佸姩鎬佽矾鐢辨帴鍏ャ€侀〉闈㈢姸鎬佷笌鍝嶅簲寮忛獙鏀躲€�

### 褰撳墠鍒ゆ柇

- 鏈闇€姹傚睘浜庢柊澧為〉闈㈣兘鍔涳紝宸叉寜椤圭洰瑙勫垯鍏堣蛋 OpenSpec锛屽皻鏈慨鏀逛笟鍔′唬鐮併€�
- 鍚庣鎺ュ彛鍜屽瓧娈靛綋鍓嶆湭纭畾锛屽洜姝よ璁′笂鍏堥鐣� `PersonalCenterOverview` 鍓嶇瑙嗗浘妯″瀷銆丄PI Client銆丷eact Query hooks 鍜� Mock/adapter 灞傦紝閬垮厤椤甸潰鐩存帴渚濊禆鏈‘璁ゅ瓧娈点€�
- 椤甸潰 routeKey 鏆傚畾涓� `account.personalCenter`锛屽悗缁疄鐜版椂閫氳繃鐜版湁闈欐€佽矾鐢辨敞鍐岃〃鎺ュ叆锛屽悗绔姩鎬佽彍鍗曞彧涓嬪彂 routeKey 涓庢潈闄愮爜銆�

### 涓嬩竴姝�

1. 绛夊緟鐢ㄦ埛纭鈥滃紑濮嬫墽琛屸€濆悗锛屽啀鎸� `openspec/changes/add-personal-center-page/tasks.md` 瀹炴柦浠ｇ爜銆�
2. 瀹炴柦鏃朵紭鍏堝畬鎴愯处鍙峰煙绫诲瀷銆丄PI Client銆丷eact Query hook 鍜� Mock 鏁版嵁锛屽啀鎺ヨ矾鐢卞拰椤甸潰 UI銆�
3. 鐪熷疄鍚庣鎺ュ彛纭鍚庯紝鍙湪 API adapter 灞傛槧灏勫瓧娈碉紝椤甸潰缁х画娑堣垂绋冲畾鐨� `PersonalCenterOverview`銆�

### 楠岃瘉缁撴灉

- 宸叉墽琛岋細`cmd /c openspec status --change add-personal-center-page`
- 宸叉墽琛岋細`cmd /c openspec validate add-personal-center-page --strict`
- 缁撴灉锛歄penSpec 鏍￠獙閫氳繃锛�4/4 artifacts complete銆�
- 灏氭湭杩愯鍓嶇娴嬭瘯锛涙湰闃舵鍙垱寤� OpenSpec 浠诲姟锛屾湭杩涘叆涓氬姟浠ｇ爜瀹炵幇銆�

---

## 2026-07-03 绉垎缁熻椤甸潰 OpenSpec 浠诲姟鍒涘缓

### 宸插畬鎴�

- 宸叉寜闇€姹傚垱寤� OpenSpec change锛歚add-points-usage-statistics-page`銆�
- 宸插畬鎴愰」鐩笂涓嬫枃鎵弿锛岀‘璁ゅ綋鍓嶆妧鏈爤涓� Vite + React + TypeScript + Ant Design + TailwindCSS锛屼笖宸叉湁搴旂敤澹炽€佽矾鐢辨敞鍐岃〃鍜屾繁鑹插伐浣滃彴椋庢牸銆�
- 宸叉牴鎹敤鎴锋彁渚涚殑鍙傝€冨浘锛屾槑纭Н鍒嗙粺璁￠〉閲囩敤鈥滈《閮ㄦ瑙堝崱鐗� + 浣跨敤缁熻鍗＄墖 + 涓嬫柟绉垎浣跨敤璁板綍琛ㄦ牸鈥濈殑椤甸潰缁撴瀯銆�
- 宸插垱寤轰互涓� OpenSpec 鏂囨。锛�
  - `openspec/changes/add-points-usage-statistics-page/proposal.md`
  - `openspec/changes/add-points-usage-statistics-page/design.md`
  - `openspec/changes/add-points-usage-statistics-page/specs/points-usage-statistics-page/spec.md`
  - `openspec/changes/add-points-usage-statistics-page/tasks.md`

### 褰撳墠鍒ゆ柇

- 鏈渶姹傚睘浜庣Н鍒嗕綋绯荤殑鏂伴〉闈㈣兘鍔涳紝搴斿厛璧� OpenSpec锛屼笉鐩存帴淇敼涓氬姟浠ｇ爜銆�
- 褰撳墠鎺ュ彛瀛楁鏈畾锛屽悗缁疄鐜板繀椤诲厛瀹氫箟 TypeScript 绫诲瀷銆丄PI Client銆丷eact Query hooks 鍜� Mock 鏁版嵁锛屼笉鑳芥妸涓存椂瀛楁鏁ｈ惤鍦ㄩ〉闈� JSX 涓€�
- 绉垎浣跨敤璁板綍灞炰簬瀹¤鍨嬮暱鍒楄〃锛屽簲浠庝竴寮€濮嬫寜鏈嶅姟绔垎椤点€佺瓫閫夈€佹帓搴忓舰鎬佽璁°€�
- 鈥滆鎯呪€濇寜閽綋鍓嶉€傚悎浣跨敤 Drawer 鎴� Modal 鎵胯浇锛屼笉闇€瑕佸厛鏂板鐙珛璇︽儏椤点€�

### 涓嬩竴姝�

1. 绛夊緟鐢ㄦ埛纭鏄惁杩涘叆鈥滃紑濮嬫墽琛屸€濋樁娈点€�
2. 鑻ョ‘璁ゆ墽琛岋紝浼樺厛瀹炵幇绉垎绫诲瀷銆丮ock 鏁版嵁銆丄PI Client 鍜� React Query hooks銆�
3. 鍐嶅疄鐜伴〉闈㈠竷灞€銆佽褰曡〃鏍笺€佽鎯呭脊绐�/鎶藉眽鍜岃矾鐢辫彍鍗曟帴鍏ャ€�

### 楠岃瘉缁撴灉

- 宸插畬鎴� OpenSpec change 鑴氭墜鏋跺垱寤恒€�
- 宸插畬鎴� OpenSpec 鍥涚被鏂囨。鍒涘缓銆�
- 灏氭湭淇敼涓氬姟浠ｇ爜銆�
- OpenSpec 鏍￠獙寰呮墽琛屻€�

---

## 2026-07-03 绉垎缁熻椤甸潰 OpenSpec 鏍￠獙瀹屾垚

### 宸插畬鎴�

- 宸插鏌� `add-points-usage-statistics-page` 鐨� OpenSpec 鐘舵€侊紝proposal銆乨esign銆乻pecs銆乼asks 鍥涚被鏂囨。鍧囧凡瀹屾垚銆�
- 宸蹭慨姝� OpenSpec 鏍￠獙鍛戒护鍙傛暟锛屾敼鐢� `openspec validate --changes --json --no-interactive`銆�

### 褰撳墠鍒ゆ柇

- 绉垎缁熻椤甸潰 OpenSpec 浠诲姟宸插叿澶囪繘鍏ュ疄鐜伴樁娈电殑鏉′欢銆�
- 鏈樁娈靛彧鍒涘缓鍜屾牎楠� OpenSpec 鏂囨。锛屾湭淇敼涓氬姟浠ｇ爜銆�

### 涓嬩竴姝�

1. 绛夊緟鐢ㄦ埛纭鈥滃紑濮嬫墽琛屸€濄€�
2. 纭鍚庢寜 `tasks.md` 浠庣被鍨嬨€丮ock銆丄PI Client銆丷eact Query hooks 寮€濮嬪疄鐜般€�
3. 鍐嶆帴鍏ラ〉闈€€佽鎯呮寜閽€佽矾鐢辫彍鍗曞拰娴嬭瘯楠岃瘉銆�

### 楠岃瘉缁撴灉

- OpenSpec status 宸叉樉绀� `isComplete: true`銆�
- OpenSpec validate 宸蹭娇鐢ㄦ纭弬鏁版墽琛屻€�
---

## 2026-07-03 涓汉涓績閭€璇峰姛鑳� OpenSpec 琛ュ厖

### 宸插畬鎴�

- 宸叉牴鎹柊澧炲弬鑰冨浘锛屽皢涓汉涓績鍙充笅瑙掆€滈個璇峰鍔扁€濆崱鐗囪ˉ鍏呰繘 `add-personal-center-page` OpenSpec change銆�
- 宸叉洿鏂� `proposal.md`锛屾妸閭€璇峰鍔辩撼鍏ヤ釜浜轰腑蹇冮〉闈㈣寖鍥达紝鍖呭惈閭€璇风爜灞曠ず銆佸鍒堕個璇风爜鍏ュ彛銆侀個璇峰鍔辫鍒欐彁绀恒€�
- 宸叉洿鏂� `design.md`锛屽湪 `PersonalCenterOverview` 涓ˉ鍏� `invitation` 瀛楁锛屽苟鏄庣‘閭€璇峰綊鍥犮€佸鍔辩粨绠椾笉鐢卞墠绔垽鏂€�
- 宸叉洿鏂� `specs/personal-center-page/spec.md`锛屾柊澧� `Invitation reward card` 闇€姹傦紝瑕嗙洊鍚敤銆佸鍒躲€佺鐢ㄤ笁绫诲満鏅€�
- 宸叉洿鏂� `tasks.md`锛岃ˉ鍏呴個璇峰瓧娈点€侀個璇峰崱鐗囥€佸鍒朵氦浜掋€佸搷搴斿紡甯冨眬鍜屾祴璇曚换鍔°€�

### 褰撳墠鍒ゆ柇

- 閭€璇峰姛鑳藉睘浜庝釜浜轰腑蹇冮〉闈㈠閲忥紝涓嶉渶瑕佸彟寮€ OpenSpec change锛岀洿鎺ヨˉ鍏� `add-personal-center-page` 鏇存竻鏅般€�
- 鍓嶇鏈樁娈靛彧璐熻矗灞曠ず閭€璇风爜銆佸鍒堕個璇风爜鎴栭個璇烽摼鎺ャ€佸睍绀哄鍔辫鍒欙紱閭€璇峰叧绯昏拷韪€佸鍔卞彂鏀俱€佺Н鍒嗗叆璐﹀簲鐢卞悗绔拰绉垎浣撶郴璐熻矗銆�
- 鍚庣瀛楁鏈畾鏃讹紝鍓嶇閫氳繃 `PersonalCenterOverview.invitation` 鍋氱ǔ瀹氳鍥炬ā鍨嬮鐣欍€�

### 涓嬩竴姝�

1. 绛夊緟鐢ㄦ埛纭鈥滃紑濮嬫墽琛屸€濆悗锛屾寜鏇存柊鍚庣殑 `tasks.md` 瀹炴柦涓汉涓績椤甸潰浠ｇ爜銆�
2. 瀹炴柦鏃朵负閭€璇峰鍔辫ˉ鍏� Mock 鏁版嵁銆佸鍒惰涓恒€佹垚鍔�/澶辫触鍙嶉鍜屽搴旀祴璇曘€�
3. 鍚庣画鑻ヨ鍋氶個璇锋槑缁嗐€侀個璇锋捣鎶ャ€侀個璇烽摼鎺ョ粺璁★紝搴斿彟寮€鏇村叿浣撶殑閭€璇蜂綋绯绘垨绉垎濂栧姳 change銆�

### 楠岃瘉缁撴灉

- 宸叉墽琛岋細`cmd /c openspec validate add-personal-center-page --strict`
- 宸叉墽琛岋細`cmd /c openspec status --change add-personal-center-page`
- 缁撴灉锛歄penSpec 鏍￠獙閫氳繃锛�4/4 artifacts complete銆�
- 灏氭湭淇敼涓氬姟浠ｇ爜锛屽皻鏈繍琛屽墠绔祴璇曘€�

---

## 2026-07-03 绉垎缁熻椤甸潰瑙嗚绾︽潫璋冩暣

### 宸插畬鎴�

- 宸叉牴鎹敤鎴峰弽棣堟洿鏂扮Н鍒嗙粺璁￠〉闈� OpenSpec 鏂囨。銆�
- 宸叉槑纭〉闈㈠彧鍙傝€冨浘鐗囩殑甯冨眬缁撴瀯锛屼笉娌跨敤鍥剧墖涓殑棰滆壊銆佸瓧浣撱€佸崱鐗囥€佹寜閽垨琛ㄦ牸椋庢牸銆�
- 宸茶姹傚悗缁疄鐜版椂棰滆壊銆佸瓧浣撱€佸渾瑙掋€佸崱鐗囥€佹寜閽€佽〃鏍煎拰鐘舵€佸弽棣堝叏閮ㄩ噰鐢ㄥ綋鍓嶉」鐩幇鏈夐鏍笺€�
- 宸插悓姝ユ洿鏂颁互涓嬫枃妗ｏ細
  - `openspec/changes/add-points-usage-statistics-page/proposal.md`
  - `openspec/changes/add-points-usage-statistics-page/design.md`
  - `openspec/changes/add-points-usage-statistics-page/specs/points-usage-statistics-page/spec.md`
  - `openspec/changes/add-points-usage-statistics-page/tasks.md`

### 褰撳墠鍒ゆ柇

- 鍙傝€冨浘鐜板湪鍙綔涓哄竷灞€鍙傝€冿紝涓嶄綔涓鸿瑙変富棰樺弬鑰冦€�
- 鍚庣画瀹炵幇蹇呴』鍏堟鏌ョ幇鏈夐〉闈㈡牱寮忥紝鍐嶅仛绉垎椤垫帓鐗堬紝閬垮厤鍑虹幇鐙珛鐨勬柊涓婚銆�

### 涓嬩竴姝�

1. 绛夊緟鐢ㄦ埛纭鈥滃紑濮嬫墽琛屸€濄€�
2. 纭鍚庢寜鐜版湁椤圭洰瑙嗚椋庢牸瀹炵幇绉垎缁熻椤点€�
3. 瀹炵幇瀹屾垚鍚庤ˉ鍏呴〉闈㈡祴璇曚笌杩涘睍璁板綍銆�

### 楠岃瘉缁撴灉

- OpenSpec 鏍￠獙寰呮湰娆¤褰曡拷鍔犲悗鎵ц銆�

---

## 2026-07-03 鐧诲綍寮哄埗淇敼瀵嗙爜瀹炵幇杩涘睍 01

### 宸插畬鎴�

- 宸茶繘鍏� OpenSpec apply 闃舵锛屼娇鐢� change锛歚force-password-change-dialog-on-login`銆�
- 宸茶鍙� `openspec/config.yaml`銆乣openspec/project.md`銆乸roposal銆乨esign銆乻pec 鍜� tasks銆�
- 宸插鏍哥櫥褰曢〉銆佺櫥褰曢〉娴嬭瘯銆乤uth API銆乤uth 绫诲瀷銆佽姹傚眰鍜岄壌鏉冨瓨鍌ㄤ唬鐮併€�
- 宸茬‘璁� `RequestBusinessError` 浼氫繚鐣� `code`銆乣message`銆乣data`锛屽彲鏀拺 `C10001` 鍒嗘敮璇嗗埆銆�
- 宸插畬鎴� tasks 1.1銆�1.2銆�1.3 鍕鹃€夈€�

### 褰撳墠鍒ゆ柇

- 褰撳墠鐢熶骇浠ｇ爜浠嶈皟鐢� `/auth/change-password`锛岄渶瑕佹敼涓� `/auth/password`銆�
- 褰撳墠寮哄埗鏀瑰瘑 UI 鏄櫥褰曢〉鍐呰仈琛ㄥ崟锛屼笉绗﹀悎鈥滃脊绐椻€濊姹傘€�
- 闇€瑕佸厛琛ュけ璐ユ祴璇曪紝鍐嶅疄鐜� API 璺緞鍜屽脊绐椾氦浜掋€�

### 涓嬩竴姝�

1. 鍏堣ˉ鍏呭け璐ユ祴璇曡鐩� `/auth/password`銆丅earer token銆佸己鍒舵敼瀵嗗脊绐椼€佹牎楠屽拰鎴愬姛鍚庨噸鏂扮櫥褰曟彁绀恒€�
2. 鍐嶄慨鏀� API 灞傚拰 `LoginPage.tsx`銆�

### 楠岃瘉缁撴灉

- 灏氭湭杩愯娴嬭瘯锛涗笅涓€闃舵浼氬厛杩愯鏂板澶辫触娴嬭瘯纭 RED銆�
---

## 2026-07-03 鐧诲綍寮哄埗淇敼瀵嗙爜瀹炵幇杩涘睍 02

### 宸插畬鎴�

- 宸插疄鐜� `force-password-change-dialog-on-login` 鐨勪笟鍔′唬鐮佷笌娴嬭瘯銆�
- 宸插皢 `changePassword` 鎺ュ彛璺緞浠� `/auth/change-password` 璋冩暣涓� `/auth/password`銆�
- 宸蹭繚鎸� `ChangePasswordRequest` 璇锋眰浣撳瓧娈典负锛歚oldPassword`銆乣newPassword`銆乣confirmPassword`銆�
- 宸茬‘淇� `/auth/password` 涓嶄娇鐢� `noAuth()`锛岀户缁蛋缁熶竴璇锋眰灞傝嚜鍔ㄦ惡甯� `Authorization: Bearer <token>`銆�
- 宸插皢鐧诲綍椤� `C10001` 鍒嗘敮璋冩暣涓哄己鍒朵慨鏀瑰瘑鐮佸脊绐楋細
  - 鐧诲綍杩斿洖 `C10001` 涓斿甫 token 鏃讹紝鍏堝啓鍏ヤ复鏃� token銆�
  - 淇濇寔鐢ㄦ埛鍋滅暀鍦ㄧ櫥褰曢〉锛屼笉璺宠浆鍒颁笟鍔¤矾鐢便€�
  - 浣跨敤 Ant Design `Modal` 鎵胯浇鏃у瘑鐮併€佹柊瀵嗙爜銆佺‘璁ゅ瘑鐮佽〃鍗曘€�
  - 绂佹閬僵鍜岄敭鐩樿鍏抽棴銆�
  - 淇敼鎴愬姛鍚庢竻鐞嗘湰鍦扮櫥褰曟€侊紝鎻愮ず鈥滃瘑鐮佷慨鏀规垚鍔燂紝璇烽噸鏂扮櫥褰曗€濓紝鍒锋柊楠岃瘉鐮佸苟鍥炲埌鐧诲綍琛ㄥ崟銆�
- 宸茶ˉ鍏呮祴璇曪細
  - `src/api/system/auth/index.test.ts`
  - `src/pages/LoginPage.test.tsx`
  - `vitest.force-password-change-temp.config.ts`
- 宸插畬鎴� tasks 2.x銆�3.x銆�4.x銆�5.1銆�5.2銆�5.3 鍕鹃€夈€�

### 褰撳墠鍒ゆ柇

- 鏈闇€姹備富閾捐矾宸查棴鐜細`C10001 -> 寮圭獥 -> /auth/password + token -> 鎴愬姛鍚庨噸鏂扮櫥褰曟彁绀篳銆�
- 椤圭洰榛樿 Vitest 閰嶇疆浼氭帓闄ゆ櫘閫� `src/**/*.test.*` 鏂囦欢锛屽洜姝ゆ湰娆℃柊澧炰簡涓存椂閰嶇疆 `vitest.force-password-change-temp.config.ts` 鐢ㄤ簬鐪熷疄鏀堕泦鐩稿叧娴嬭瘯銆�
- 鐧诲綍椤典粛瀛樺湪閮ㄥ垎鍘嗗彶涔辩爜鏂囨锛屾湰娆″彧淇涓庡己鍒舵敼瀵嗛摼璺洿鎺ョ浉鍏崇殑鍔熻兘鍜屾祴璇曪紝娌℃湁鎵╁ぇ閲嶅啓鑼冨洿銆�

### 涓嬩竴姝�

1. 濡傞渶缁х画锛屽彲浠ユ墜鍔ㄨ仈璋冨悗绔‘璁� `/auth/password` 鐨勭湡瀹炲搷搴旀牸寮忋€�
2. 濡傞渶鏀跺彛鍘嗗彶涔辩爜锛屽彲鍗曠嫭鍒涘缓 OpenSpec 鎴栧皬淇换鍔″鐞嗙櫥褰曢〉鏂囨缂栫爜銆�
3. 褰撳墠 change 宸插叿澶囧綊妗ｆ潯浠讹紝鍚庣画鍙墽琛� OpenSpec archive銆�

### 楠岃瘉缁撴灉

- 宸叉墽琛岋細`npm test -- --config vitest.force-password-change-temp.config.ts`
  - 缁撴灉锛�3 涓祴璇曟枃浠堕€氳繃锛�17 涓敤渚嬮€氳繃銆�
  - 璇存槑锛氭祴璇曡緭鍑轰粛鏈� jsdom 瀵� `getComputedStyle(..., pseudoElements)` 鐨� 鈥淣ot implemented鈥� 鎻愮ず锛屼絾鏈鑷村け璐ャ€�
- 宸叉墽琛岋細`npm run typecheck`
  - 缁撴灉锛氶€氳繃銆�
- 宸叉墽琛岋細`cmd /c openspec validate force-password-change-dialog-on-login --strict`
  - 缁撴灉锛氶€氳繃銆�
## 2026-07-03 绉垎缁熻椤甸潰鎵ц杩涘睍

### 宸插畬鎴�
- 宸插畬鎴� OpenSpec change `add-points-usage-statistics-page` 鐨勫墠绔疄鐜版敹灏俱€�
- 宸叉柊澧炵Н鍒嗙粺璁￠〉闈紝鍖呭惈椤堕儴绉垎姒傝鍗＄墖銆佷娇鐢ㄧ粺璁″崱鐗囥€佺瓫閫夊尯銆佺Н鍒嗕娇鐢ㄨ褰曞垪琛ㄥ拰璇︽儏 Drawer銆�
- 宸叉柊澧炵Н鍒嗕娇鐢ㄨ褰� API 绫诲瀷銆丮ock 鏁版嵁銆丄PI Client 涓� React Query hooks锛屼负鍚庣画鐪熷疄鎺ュ彛瀛楁棰勭暀閫傞厤灞傘€�
- 宸叉帴鍏ラ潤鎬佽矾鐢变笌鍔ㄦ€佽彍鍗曟槧灏勶紝棰勭暀椤甸潰鏉冮檺鐮� `points:usage:view` 鍜岃鎯呮搷浣滄墿灞曠偣銆�
- 宸蹭慨澶嶈鎯呮寜閽棤闅滅鍚嶇О锛岃В鍐� Ant Design 灏忔寜閽腑鏂囨枃鏈湪娴嬭瘯涓鎷嗗垎瀵艰嚧鏌ヨ澶辫触鐨勯棶棰樸€�
- 宸插皢 OpenSpec `tasks.md` 涓湰娆＄Н鍒嗙粺璁￠〉闈㈢浉鍏充换鍔″叏閮ㄦ爣璁板畬鎴愩€�

### 褰撳墠鍒ゆ柇
- 椤甸潰瑙嗚鍙鐢ㄥ綋鍓嶉」鐩凡鏈夐鑹插彉閲忋€佸崱鐗囥€佽〃鏍笺€佹寜閽拰鐘舵€佺粍浠堕鏍硷紱鍙傝€冨浘鍙敤浜庡竷灞€缁撴瀯锛屼笉寮曞叆鏂颁富棰樿壊銆�
- 褰撳墠鍚庣鏆傛棤鏄庣‘绉垎瀛楁锛屽墠绔€氳繃绫诲瀷鍜� API 閫傞厤灞傞泦涓鐣欙紝閬垮厤椤甸潰灞傛暎钀戒复鏃跺瓧娈点€�

### 楠岃瘉缁撴灉
- `npm test -- --config vitest.points-usage-statistics-temp.config.ts`锛氶€氳繃锛�4 涓祴璇曟枃浠� / 8 涓祴璇曞叏閮ㄩ€氳繃銆�
- `npm run typecheck`锛氶€氳繃銆�
- `cmd /c openspec validate --changes --json --no-interactive`锛氶€氳繃锛�3 涓� active change 鍧� valid銆�

### 涓嬩竴姝�
- 绛夌湡瀹炲悗绔帴鍙ｅ瓧娈点€佽彍鍗曡矾寰勬垨鎸夐挳绾ф潈闄愯鍒欑‘璁ゅ悗锛屽皢 API 閫傞厤灞傚拰璇︽儏鏉冮檺鐐瑰鎺ュ埌鐪熷疄鏁版嵁銆�

## 2026-07-03 C10001 鐪熷疄鍝嶅簲濂戠害澶嶆牳

- 宸插畬鎴愶細閲嶆柊璇诲彇 OpenSpec apply 鎸囦护銆乸roposal/design/spec/tasks 涓庣櫥褰曢〉鐩稿叧浠ｇ爜锛岀‘璁ゅ綋鍓嶅疄鐜颁粛鎶� token 浣滀负寮哄埗鏀瑰瘑寮圭獥鎵撳紑鏉′欢銆�
- 褰撳墠鍒ゆ柇锛氬悗绔湡瀹炶繑鍥炰负 `{ code: "C10001", data: null, msg: "璇峰厛淇敼鍒濆瀵嗙爜" }`锛屽洜姝ゅ脊绐楄Е鍙戝繀椤诲彧渚濊禆 `code === "C10001"`锛宼oken 鍙兘浣滀负鍙€変笂涓嬫枃銆�
- 涓嬩竴姝ワ細璋冩暣 `LoginPage` 绫诲瀷瀹堝崼鍜屽脊绐楁墦寮€鏉′欢锛岃ˉ鍏� data:null 鍥炲綊娴嬭瘯锛屽苟鍚屾淇 OpenSpec 瑙勬牸銆�
- 楠岃瘉缁撴灉锛氬皻鏈噸鏂拌窇娴嬭瘯锛屼笅涓€闃舵浠ｇ爜淇鍚庢墽琛屻€�
## 2026-07-03 C10001 data:null 鍏煎瀹炵幇

- 宸插畬鎴愶細璋冩暣 `LoginPage` 寮哄埗鏀瑰瘑绫诲瀷瀹堝崼锛宍C10001` 涓嶅啀瑕佹眰 `data.accessToken/refreshToken`锛涘脊绐楁墦寮€鏉′欢鏀逛负瀛樺湪鏀瑰瘑涓婁笅鏂囷紱鍙湁鍝嶅簲閲岀湡鐨勫甫 token 鏃舵墠璋冪敤 `AuthStorage.setTokenPair`銆�
- 褰撳墠鍒ゆ柇锛氬墠绔幇鍦ㄥ吋瀹� `{ code: "C10001", data: null, msg: "璇峰厛淇敼鍒濆瀵嗙爜" }` 鍜屾棫鐨勫甫 token 鍝嶅簲锛屼笉浼氫吉閫� token銆�
- 涓嬩竴姝ワ細杩愯鐧诲綍椤�/API 瀹氬悜娴嬭瘯銆乀ypeScript 绫诲瀷妫€鏌ュ拰 OpenSpec strict 鏍￠獙銆�
- 楠岃瘉缁撴灉锛氬凡纭鏃у疄鐜颁笅 `data:null` 鐢ㄤ緥澶辫触锛涗慨澶嶅悗鐨勯獙璇佸緟鎵ц銆�
## 2026-07-03 C10001 data:null 楠岃瘉瀹屾垚

- 宸插畬鎴愶細琛ュ厖 `C10001 data:null` 寮圭獥鍥炲綊娴嬭瘯锛屽苟澧炲姞 `C10001` 甯� token 鏃朵粛涓存椂淇濆瓨 token 鐨勫吋瀹规祴璇曪紱鍚屾鏇存柊 OpenSpec spec/design锛屾槑纭� `C10001` 鏄脊绐楄Е鍙戜俊鍙凤紝`data` 鍙槸鍙€� token 涓婁笅鏂囥€�
- 褰撳墠鍒ゆ柇锛氱櫥褰曢〉宸插吋瀹圭湡瀹炶繑鍥� `{ code: "C10001", data: null, msg: "璇峰厛淇敼鍒濆瀵嗙爜" }`锛涗笉浼氬洜缂哄皯 token 鑰岃烦杩囧己鍒舵敼瀵嗗脊绐楋紝涔熶笉浼氫吉閫� token銆�
- 涓嬩竴姝ワ細鍙寜鍥㈤槦娴佺▼杩涜浠ｇ爜 review锛涜嫢鍚庣纭 `/auth/password` 鍦� `data:null` 鍦烘櫙浠嶅己鍒惰姹� Bearer token锛屽垯闇€瑕佸悗绔皟鏁磋繑鍥� token 鎴栨彁渚涘叾浠栦細璇濋壌鏉冩満鍒躲€�
- 楠岃瘉缁撴灉锛歚npm test -- --config vitest.force-password-change-temp.config.ts` 閫氳繃锛�3 files / 18 tests锛夛紱`npm run typecheck` 閫氳繃锛沗cmd /c openspec validate force-password-change-dialog-on-login --strict` 閫氳繃銆�
## 2026-07-03 鏆傚仠 C10001 data:null 璋冩暣

- 宸插畬鎴愶細鏍规嵁鐢ㄦ埛瑕佹眰锛屾殏鍋溾€渀C10001` 涓� `data:null` 涔熸墦寮€寮哄埗鏀瑰瘑寮圭獥鈥濈殑璋冩暣鏂瑰悜锛涚櫥褰曢〉鎭㈠涓哄彧鏈� `C10001` 涓旇繑鍥炲彲鐢� token 鏃舵墠鎵撳紑寮哄埗鏀瑰瘑寮圭獥銆�
- 褰撳墠鍒ゆ柇锛氬綋鍓嶇敓鏁堝绾︿粛鏄� `/auth/password` 闇€瑕� token 閴存潈锛涚己灏戝彲鐢� token 鏃舵寜鐧诲綍澶辫触澶勭悊骞跺埛鏂伴獙璇佺爜銆�
- 涓嬩竴姝ワ細杩愯瀹氬悜娴嬭瘯銆佺被鍨嬫鏌ュ拰 OpenSpec 鏍￠獙锛岀‘璁ゅ洖閫€鍚庤涓虹ǔ瀹氥€�
- 楠岃瘉缁撴灉锛氬緟鎵ц銆�
## 2026-07-03 鏆傚仠 data:null 璋冩暣楠岃瘉瀹屾垚

- 宸插畬鎴愶細鍥為€€ `LoginPage` 涓� `C10001 data:null` 涔熸墦寮€寮圭獥鐨勯€昏緫锛屾仮澶嶄负蹇呴』鎼哄甫鍙敤 token 鎵嶈繘鍏ュ己鍒舵敼瀵嗗脊绐楋紱鍚屾鎭㈠ OpenSpec spec锛屽苟鍦� design 涓拷鍔犲綋鍓嶇敓鏁堝喅绛栬鏄庛€�
- 褰撳墠鍒ゆ柇锛氬綋鍓嶆柟妗堜粛瑕佹眰寮哄埗鏀瑰瘑閾捐矾渚濊禆鐧诲綍鎺ュ彛杩斿洖 token锛屼繚璇� `/auth/password` 鑳介€氳繃缁熶竴璇锋眰鎷︽埅鍣ㄦ惡甯� Bearer token銆�
- 涓嬩竴姝ワ細濡傛灉鍚庣画鍚庣纭 `C10001` 鍙繑鍥� `data:null`锛岄渶瑕侀噸鏂扮‘璁ゅ悗绔壌鏉冩柟妗堝悗鍐嶆敼鍓嶇銆�
- 楠岃瘉缁撴灉锛歚npm test -- --config vitest.force-password-change-temp.config.ts` 閫氳繃锛�3 files / 18 tests锛夛紱`npm run typecheck` 閫氳繃锛沗cmd /c openspec validate force-password-change-dialog-on-login --strict` 閫氳繃銆�---

## 2026-07-04 涓汉涓績 OpenSpec 浠诲姟閲嶆柊鐢熸垚

### 宸插畬鎴�

- 宸茶鍙栫敤鎴疯ˉ鍏呭悗鐨� `openspec/changes/add-personal-center-page/proposal.md`銆�
- 宸叉牴鎹� proposal 鏂板鍐呭閲嶆柊鐢熸垚 `openspec/changes/add-personal-center-page/tasks.md`銆�
- 鏂颁换鍔℃竻鍗曞凡琛ュ厖浠ヤ笅閲嶇偣锛�
  - 鍏堝畬鎴愪釜浜轰腑蹇冮〉闈㈡湰浣擄紝鍐嶇瓑鍚庣鎺ュ彛鍜屽瓧娈电‘瀹氬悗鎺ョ湡瀹炴帴鍙ｃ€�
  - 鏂板 `account.personalCenter` 璺敱鍜屽姩鎬佽彍鍗曟帴鍏ヤ换鍔°€�
  - 澧炲姞涓汉涓績璺宠浆鍏ュ彛浠诲姟锛氫紭鍏堝鐢ㄥ凡鏈夌敤鎴蜂笅鎷夊叆鍙ｏ紝鍚﹀垯浣跨敤渚ц竟鏍忓簳閮ㄥ浘鏍�/鎸夐挳鍏ュ彛銆�
  - 淇濈暀閭€璇峰鍔卞崱鐗囥€佸鍒堕個璇风爜銆丮ock 瑙嗗浘妯″瀷銆侀〉闈㈢姸鎬併€佸搷搴斿紡鍜屾祴璇曚换鍔°€�
  - 鏄庣‘涓嶅湪鏈� change 鍐呭疄鐜伴個璇峰綊鍥犮€佸鍔辩粨绠椼€佸厖鍊兼敮浠樸€佺紪杈戣祫鏂欐彁浜ゃ€佹墜鏈虹粦瀹氥€佷慨鏀瑰瘑鐮佸悗绔祦绋嬨€�

### 褰撳墠鍒ゆ柇

- 褰撳墠鍙噸鐢熸垚 OpenSpec 浠诲姟锛屾病鏈変慨鏀逛笟鍔′唬鐮併€�
- proposal 涓柊澧炵殑鈥滈〉闈㈠厛瀹屾垚鈥濃€滃悗绔瓧娈靛悗鎺モ€濃€滀釜浜轰腑蹇冨叆鍙ｈ烦杞€濆凡缁忚繘鍏ヤ换鍔℃竻鍗曘€�
- `design.md` 鍜� `spec.md` 褰撳墠浠嶅彲鏀拺浠诲姟鎵ц锛涘悗缁鏋� proposal 鍐嶆柊澧炵‖鎬ч獙鏀惰鍒欙紝闇€瑕佸悓姝ユ洿鏂� spec銆�

### 涓嬩竴姝�

1. 绛夊緟鐢ㄦ埛纭鈥滃紑濮嬫墽琛屸€濆悗锛屾寜閲嶆柊鐢熸垚鐨� `tasks.md` 杩涘叆浠ｇ爜瀹炵幇銆�
2. 瀹炵幇鍓嶅厛澶嶆牳 `DashboardLayout`锛岀‘瀹氫釜浜轰腑蹇冨叆鍙ｅ簲鏀惧湪鐢ㄦ埛涓嬫媺杩樻槸渚ц竟鏍忓簳閮ㄣ€�
3. 瀹炵幇瀹屾垚鍚庤繍琛屼釜浜轰腑蹇冪浉鍏冲畾鍚戞祴璇曘€乣npm run typecheck` 鍜� OpenSpec 鏍￠獙銆�

### 楠岃瘉缁撴灉

- 宸叉墽琛岋細`cmd /c openspec validate add-personal-center-page --strict`
- 宸叉墽琛岋細`cmd /c openspec status --change add-personal-center-page`
- 缁撴灉锛歄penSpec 鏍￠獙閫氳繃锛�4/4 artifacts complete銆�
- 灏氭湭杩愯鍓嶇娴嬭瘯锛涙湰闃舵鍙噸鏂扮敓鎴愪换鍔℃枃妗ｃ€�

---

## 2026-07-07 UI/UX Pro Max 鍒濆鍖�

### 宸插畬鎴�

- 宸茬‘璁ゅ綋鍓嶉」鐩负 Vite + React + TypeScript 鍓嶇椤圭洰锛屽寘绠＄悊渚у瓨鍦� `package.json` 涓� `package-lock.json`銆�
- 宸茬‘璁ゆ湰鏈哄瓨鍦� `uipro` 鍛戒护锛屽苟鏌ョ湅 `uipro init --help`锛岀‘璁ら粯璁ゅ畨瑁呭埌褰撳墠椤圭洰锛屾湭浣跨敤 `--force` 瑕嗙洊鍙傛暟銆�
- 鎵ц鍘熷鍛戒护 `uipro init` 鏃惰繘鍏ヤ氦浜掗€夋嫨鐣岄潰锛涗负閬垮厤鑷姩鍖栫粓绔崱鍦ㄩ€夋嫨姝ラ锛屾敼鐢ㄧ瓑浠风殑闈炰氦浜掑懡浠� `uipro init -a codex`銆�
- 宸叉垚鍔熷畨瑁� Codex 渚� UI/UX Pro Max 鑳藉姏锛屾柊澧� `.codex/skills/ui-ux-pro-max/` 浠ュ強璁捐銆佸搧鐗屻€佸够鐏墖銆佹牱寮忕瓑鐩稿叧鎶€鑳界洰褰曘€�

### 褰撳墠鍒ゆ柇

- 鏈鍒濆鍖栧彧鏂板 Codex 鎶€鑳戒笌閰嶇疆鐩稿叧鏂囦欢锛屾病鏈夊垹闄ゆ枃浠讹紝涔熸病鏈変慨鏀逛笟鍔℃簮鐮併€�
- 褰撳墠宸ヤ綔鍖哄湪鏈鎿嶄綔鍓嶅凡瀛樺湪澶氬鏈彁浜ゆ敼鍔紱鏈浠呮柊澧� `.codex/skills/*` 鐩稿叧鏈窡韪洰褰曪紝鏈鐞嗗叾浠栨棦鏈夋敼鍔ㄣ€�
- 鍚庣画濡傛灉瑕佸湪鏈」鐩腑浣跨敤 UI/UX Pro Max锛屽缓璁噸鍚� Codex 鎴栭噸鏂板姞杞戒細璇濓紝璁╂柊鎶€鑳借璇嗗埆銆�

### 涓嬩竴姝�

1. 濡傞渶绾冲叆鐗堟湰绠＄悊锛屽悗缁彲鍗曠嫭妫€鏌� `.codex/skills/` 鏄惁搴旀彁浜ゅ埌浠撳簱銆�
2. 濡傚彧鎯虫湰鍦颁娇鐢紝闇€瑕佺‘璁ら」鐩� `.gitignore` 鏄惁搴斿拷鐣� `.codex/` 涓嬬殑瀹夎浜х墿銆�
3. 閲嶅惎 Codex 鍚庯紝鍙户缁敤鏂� UI/UX 鎶€鑳借緟鍔╅〉闈㈣璁″拰鍓嶇瀹炵幇銆�

### 楠岃瘉缁撴灉

- 宸叉墽琛岋細`uipro --help`
- 宸叉墽琛岋細`uipro init --help`
- 宸叉墽琛岋細`uipro init -a codex`
- 宸叉墽琛岋細`rg --files .codex`
- 缁撴灉锛歚uipro init -a codex` 杩斿洖 `success UI/UX Pro Max installed successfully!`

---

## 2026-07-07 UI/UX Pro Max 浣跨敤鏂瑰紡璇存槑

### 宸插畬鎴�

- 宸茶鍙� `.codex/skills/ui-ux-pro-max/SKILL.md`锛岀‘璁よ鎶€鑳界敤浜� UI 缁撴瀯銆佽瑙夎璁°€佷氦浜掓ā寮忋€佸彲璁块棶鎬с€佸搷搴斿紡鍜岀敤鎴蜂綋楠岃川閲忔帶鍒躲€�
- 宸茶鍙� `.codex/config.toml`锛岀‘璁ゅ綋鍓嶉」鐩瓨鍦� Codex 閰嶇疆鏂囦欢銆�
- 宸叉墽琛岃剼鏈骇楠岃瘉锛歚python .codex\skills\ui-ux-pro-max\scripts\search.py "AI Hit Factory SaaS dashboard" --design-system -p "AI Hit Factory"`銆�
- 楠岃瘉缁撴灉鏄剧ず宸茶兘杩斿洖 UI Pro Max 鎺ㄨ崘璁捐绯荤粺锛岃鏄庢湰鍦板畨瑁呬骇鐗╁彲鐢ㄣ€�

### 褰撳墠鍒ゆ柇

- 褰撳墠浼氳瘽鍚姩鏃剁殑鍙敤鎶€鑳藉垪琛ㄩ噷灏氭湭鍑虹幇 `ui-ux-pro-max`锛屽洜姝ら渶瑕侀噸鍚� Codex 鎴栧紑鍚柊浼氳瘽鍚庯紝鎵嶆洿鍙兘琚� Codex 鑷姩璇嗗埆涓哄彲璋冪敤鎶€鑳姐€�
- 鍗充娇褰撳墠浼氳瘽杩樻湭鑷姩鎸傝浇鎶€鑳斤紝涔熷彲浠ラ€氳繃 `.codex/skills/ui-ux-pro-max/scripts/search.py` 鎵嬪姩鏌ヨ璁捐寤鸿銆�
- 瀵规湰椤圭洰杩欑被 React + Ant Design + Tailwind 鐨� SaaS 鍚庡彴锛屼娇鐢ㄨ鎶€鑳芥椂浠嶈浼樺厛閬靛惊椤圭洰鐜版湁瑙嗚椋庢牸锛屼笉鑳界洸鐩鐢ㄥ畠鎺ㄨ崘鐨勫叏鏂伴厤鑹叉垨瀛椾綋銆�

### 涓嬩竴姝�

1. 閲嶅惎 Codex 鎴栨柊寮€浼氳瘽鍚庯紝瑙傚療鎶€鑳藉垪琛ㄦ槸鍚﹀寘鍚� `ui-ux-pro-max`銆�
2. 鍚庣画鎻愬嚭 UI 绫婚渶姹傛椂锛屽彲鏄庣‘璇粹€滀娇鐢� UI/UX Pro Max 鍏堝垎鏋愯璁＄郴缁�/椤甸潰浣撻獙鈥濄€�
3. 鑻ラ渶瑕佹墜鍔ㄩ獙璇侊紝鍙户缁繍琛� `search.py --design-system` 鎴� `search.py --domain ux` 鏌ヨ銆�

### 楠岃瘉缁撴灉

- `python .codex\skills\ui-ux-pro-max\scripts\search.py "SaaS dashboard clean professional" --domain ux -n 3` 宸叉墽琛岋紝鍛戒护鍙繍琛屼絾璇ュ叧閿瘝鍦� ux 鍩熻繑鍥� 0 鏉°€�
- `python .codex\skills\ui-ux-pro-max\scripts\search.py "AI Hit Factory SaaS dashboard" --design-system -p "AI Hit Factory"` 宸叉墽琛岋紝鎴愬姛杩斿洖鎺ㄨ崘璁捐绯荤粺銆�

---

## 2026-07-07 UI 缁勪欢涓庢牱寮忕粺涓€瑙勮寖琛ュ厖

### 宸插畬鎴�

- 宸插湪 `AGENTS.md` 杩藉姞 UI 缁勪欢涓庢牱寮忕粺涓€瑙勮寖銆�
- 宸插湪 `openspec/project.md` 杩藉姞椤圭洰绾� UI 瑙勮寖琛ュ厖銆�
- 鏂拌鑼冩槑纭細鍚庣画缁勪欢浼樺厛浣跨敤 Ant Design锛涢噸澶嶇ǔ瀹氬満鏅紭鍏堝仛杞婚噺浜屾灏佽锛汿ailwind 璐熻矗甯冨眬銆佸搷搴斿紡鍜屽眬閮ㄥ井璋冿紱UI/UX Pro Max 鍙綔涓轰綋楠屾鏌ュ伐鍏凤紝涓嶇洿鎺ユ浛浠ｉ」鐩富棰樸€�

### 褰撳墠鍒ゆ柇

- 璇ヨ鑼冧笉浼氳嚜鍔ㄦ敼鍙樼幇鏈変笟鍔￠〉闈紝浣嗕細绾︽潫鍚庣画 OpenSpec銆侀〉闈㈠疄鐜板拰閲嶆瀯鏂瑰悜銆�
- UI/UX Pro Max 鐨勯儴鍒嗘帹鑽愬亸钀ラ攢椤垫垨鏂颁富棰橈紝鏈」鐩彧閲囩撼琛ㄥ崟銆佸姞杞姐€佸搷搴斿紡銆佸彲璁块棶鎬у拰浜や簰鍙嶉绫绘鏌ラ」锛岄伩鍏嶇牬鍧忕幇鏈� SaaS 鍚庡彴缁熶竴鎬с€�

### 涓嬩竴姝�

1. 鎵弿褰撳墠椤甸潰鍜� shared 缁勪欢锛岃瘑鍒彲鎸夋柊瑙勮寖浼樺寲鐨勯噸澶嶇粨鏋勫拰浣撻獙鐭澘銆�
2. 鍩轰簬鎵弿缁撴灉鍒涘缓涓€涓柊鐨� OpenSpec 浼樺寲 change锛屽彧鐢熸垚鏂囨。鍜屼换鍔★紝涓嶇洿鎺ヤ慨鏀逛笟鍔′唬鐮併€�

### 楠岃瘉缁撴灉

- 宸茶拷鍔犺鑼冨埌 `AGENTS.md`銆�
- 宸茶拷鍔犺鑼冨埌 `openspec/project.md`銆�
- 灏氭湭杩愯浠ｇ爜娴嬭瘯锛涙湰闃舵涓鸿鑼冩枃妗ｈˉ鍏呫€�

---

## 2026-07-07 UI 缁熶竴鎬ф壂鎻忎笌 OpenSpec 鍒涘缓

### 宸插畬鎴�

- 宸插熀浜庢柊澧� UI 瑙勮寖鎵弿褰撳墠鍓嶇椤圭洰缁撴瀯銆侀〉闈㈡枃浠朵綋閲忋€乻hared 缁勪欢鏁伴噺鍜� Ant Design/Tailwind 浣跨敤鎯呭喌銆�
- 宸蹭娇鐢� UI/UX Pro Max 鏌ヨ浣撻獙妫€鏌ラ」锛岄噰绾宠〃鍗� label銆佸紓姝ュ弽棣堛€佸搷搴斿紡琛ㄦ牸銆佹噿鍔犺浇銆佹寜閽槻閲嶅鎻愪氦绛夊缓璁紱鏈噰绾虫柊閰嶈壊銆佹柊瀛椾綋銆佹殫鑹蹭富棰樻垨钀ラ攢椤� hero 寤鸿銆�
- 宸茶瘑鍒綋鍓嶅彲浼樺寲鏂瑰悜锛�
  - `DashboardPage.tsx`銆乣AssetLibraryPage.tsx`銆乣ProductVideoPage.tsx`銆乣ViralRemixPage.tsx` 绛夐〉闈㈠瓨鍦ㄥ師鐢熸寜閽垨鏂囦欢杈撳叆浣滀负涓昏浜や簰銆�
  - `DigitalHumansPage.tsx`銆乣CustomisedAudiosPage.tsx`銆乣DigitalHumanVideoTasksPage.tsx` 鏈夐噸澶嶇殑鎸囨爣鍗°€佺瓫閫夈€佸崱鐗囩綉鏍笺€佸垎椤点€佺┖鐘舵€佸拰鍒犻櫎纭妯″紡銆�
  - `VideoRemixTaskDetailPage.tsx` 瓒呰繃 1400 琛岋紝鍐呴儴宸叉湁姝ラ瀵艰埅銆佷笂浼犺Е鍙戝櫒銆佺礌鏉愰瑙堢綉鏍笺€佽棰戦瑙堝崱绛夊彲鎷嗗垎 UI 鍧椼€�
- 宸插垱寤� OpenSpec change锛歚openspec/changes/optimize-ui-component-consistency/`銆�
- 宸茶ˉ榻� OpenSpec 鍥涗欢濂楋細
  - `proposal.md`
  - `design.md`
  - `specs/ui-component-consistency/spec.md`
  - `tasks.md`

### 褰撳墠鍒ゆ柇

- 鏈鍙槸瑙勮寖琛ュ厖銆侀」鐩壂鎻忓拰 OpenSpec 浠诲姟鍒涘缓锛屽皻鏈慨鏀逛笟鍔℃簮鐮併€�
- 浼樺寲搴斿垎鎵规帹杩涳紝浼樺厛鏇挎崲鍘熺敓涓讳氦浜掓帶浠跺拰閲嶅涓婁紶/鍒犻櫎/鍒楄〃鐘舵€佺粨鏋勶紝鍐嶆媶 `VideoRemixTaskDetailPage.tsx`锛岄伩鍏嶄竴娆℃€уぇ閲嶆瀯銆�
- 浜屾灏佽蹇呴』淇濇寔杞婚噺锛屽彧鎶界ǔ瀹氶噸澶嶇粍鍚堬紝涓嶅垱寤哄ぇ鑰屽叏鐨� `BaseForm/BaseTable/BaseModal`銆�

### 涓嬩竴姝�

1. 绛夊緟鐢ㄦ埛纭鈥滃紑濮嬫墽琛屸€濆悗锛屾寜 `optimize-ui-component-consistency/tasks.md` 鍒嗛樁娈靛疄鏂姐€�
2. 瀹炴柦鏃跺厛琛ユ祴璇曪紝鍐嶆浛鎹㈡帶浠跺拰鎶界粍浠讹紝鏈€鍚庡仛 `VideoRemixTaskDetailPage.tsx` 灞€閮ㄦ媶鍒嗐€�
3. 姣忛樁娈靛畬鎴愬悗杩愯瀹氬悜娴嬭瘯銆乣npm run typecheck` 鍜� OpenSpec 鏍￠獙銆�

### 楠岃瘉缁撴灉

- 宸叉墽琛岋細`cmd /c openspec validate optimize-ui-component-consistency --strict`
- 缁撴灉锛氶€氳繃锛宍Change 'optimize-ui-component-consistency' is valid`銆�
- 宸叉墽琛岋細`cmd /c openspec status --change optimize-ui-component-consistency`
- 缁撴灉锛�4/4 artifacts complete銆�
- 灏氭湭杩愯鍓嶇娴嬭瘯锛涙湰闃舵娌℃湁淇敼涓氬姟婧愮爜銆�

---

## 2026-07-07 鎺ュ彛閿欒鐮侀粯璁ゆ彁绀鸿ˉ鍏�

### 宸插畬鎴�

- 宸叉壂鎻忕粺涓€璇锋眰灏佽锛岀‘璁ら敊璇鐞嗛泦涓湪 `src/utils/request.ts`銆�
- 宸插湪璇锋眰灞傛柊澧炲鎴蜂晶閿欒鐮侀粯璁や腑鏂囨彁绀烘槧灏勶紝瑕嗙洊锛�
  - `C10001`銆乣C10010`銆乣C10011`銆乣C10012`銆乣C10013`銆乣C10014`銆乣C10015`
  - `C10020`銆乣C10021`銆乣C10030`
  - `C40101`銆乣C40102`銆乣C40103`
- 宸叉柊澧� `getBusinessMessage` 缁熶竴鍙栨枃妗堥€昏緫锛氫紭鍏堜娇鐢ㄥ悗绔� `msg`锛屽悗绔湭杩斿洖 `msg` 鏃跺啀鎸� `code` 浣跨敤鍓嶇榛樿鎻愮ず銆�
- 宸茶ˉ鍏� `src/utils/request.test.ts` 鍥炲綊娴嬭瘯锛岃鐩栦笟鍔″け璐ュ搷搴斿拰 HTTP 閿欒鍝嶅簲涓ゆ潯閾捐矾銆�

### 褰撳墠鍒ゆ柇

- 鏈鏀瑰姩淇濇寔鍦� request 鍩虹灞傦紝椤甸潰鍜屼笟鍔� API Client 涓嶉渶瑕侀噸澶嶇淮鎶ら敊璇爜鏂囨銆�
- 淇濈暀鍚庣 `msg` 浼樺厛绾э紝鍙互鍏煎鍚庣鍚庣画鎸夊叿浣撳満鏅繑鍥炴洿绮剧‘鎻愮ず銆�
- `C40101/C40102/C40103` 褰撳墠鍙仛榛樿鎻愮ず琛ュ厖锛屾病鏈夋搮鑷敼鐧诲綍杩囨湡璺宠浆閫昏緫锛岄伩鍏嶅奖鍝嶆棦鏈夐壌鏉冪瓥鐣ャ€�

### 涓嬩竴姝�

1. 濡傚悗绔悗缁柊澧炲鎴蜂晶閿欒鐮侊紝缁х画琛ュ厖 `businessCodeMessages` 鍜屽搴旀祴璇曘€�
2. 鑻ヤ骇鍝佸笇鏈� `C401xx` 鍏ㄩ儴瑙﹀彂閲嶆柊鐧诲綍锛岄渶瑕佸崟鐙‘璁ら壌鏉冧氦浜掔瓥鐣ュ悗鍐嶆敼 `onAuthExpired` 鍒嗘敮銆�

### 楠岃瘉缁撴灉

- 宸叉墽琛岋細`npx vitest run --config vite.request-test.config.ts src/utils/request.test.ts`
- 缁撴灉锛氶€氳繃锛宍src/utils/request.test.ts` 鍏� 11 涓祴璇曞叏閮ㄩ€氳繃銆�
## 2026-07-07 view/page 鎸夊姛鑳芥媶鍒� OpenSpec 鍒涘缓

### 宸插畬鎴�

- 宸叉寜椤圭洰瑙勫垯鍏堟壂鎻忓綋鍓嶄唬鐮佺粨鏋勫拰宸叉湁 `openspec`锛岀‘璁ら」鐩负 React + TypeScript + Vite锛孶I 鏍堜负 Ant Design + TailwindCSS锛屾湇鍔＄鐘舵€侀€氳繃 React Query hooks 鍜屼笟鍔� API Client 鍒嗗眰灏佽銆�
- 宸茶瘑鍒綋鍓� `src/pages` 椤甸潰浣撻噺鍩虹嚎锛屽吀鍨嬪ぇ鏂囦欢鍖呮嫭锛�
  - `VideoRemixTaskDetailPage.tsx`锛�1512 琛�
  - `DigitalHumanVideoTasksPage.tsx`锛�992 琛�
  - `ImageVideoPage.tsx`锛�552 琛�
  - `LoginPage.tsx`锛�534 琛�
  - `CustomisedAudiosPage.tsx`锛�520 琛�
  - `DigitalHumansPage.tsx`锛�483 琛�
  - `PointsUsageStatisticsPage.tsx`锛�432 琛�
- 宸插垽鏂凡鏈� `optimize-ui-component-consistency` 鍋� UI 鎺т欢涓€鑷存€э紝鏈闇€姹傚亸 view/page 鏂囦欢鎸夊姛鑳芥媶鍒嗭紝鍥犳鍗曠嫭鍒涘缓鏂� change锛歚openspec/changes/split-view-pages-by-feature/`銆�
- 宸茶ˉ榻� OpenSpec 鍥涗欢濂楋細
  - `openspec/changes/split-view-pages-by-feature/proposal.md`
  - `openspec/changes/split-view-pages-by-feature/design.md`
  - `openspec/changes/split-view-pages-by-feature/specs/view-page-feature-decomposition/spec.md`
  - `openspec/changes/split-view-pages-by-feature/tasks.md`

### 褰撳墠鍒ゆ柇

- 鏈鍙垱寤� OpenSpec 浠诲姟鍜屾媶鍒嗘柟妗堬紝娌℃湁淇敼 `src` 涓氬姟婧愮爜銆�
- 鎷嗗垎鏍稿績鍘熷垯鏄細`src/pages/*Page.tsx` 鍙繚鐣欒矾鐢辩骇缂栨帓銆侀〉闈㈢骇 hooks 璋冪敤鍜岃法鍖哄潡鍗忚皟锛涗笟鍔″脊绐椼€佺瓫閫夋爮銆佸崱鐗囧垪琛ㄣ€佷笂浼犻瑙堛€佺姸鎬佹淳鐢熴€佽〃鍗曟槧灏勭瓑涓嬫矇鍒板搴� `src/features/<module>`銆�
- 涓嶅缓璁负浜嗗噺灏戣鏁版満姊版媶鏂囦欢銆傜湡姝ｅ悎鐞嗙殑鎷嗗垎鏍囧噯鏄亴璐ｆ竻鏅般€佽兘闄嶄綆闃呰鎴愭湰銆佸彲娴嬭瘯锛屽苟涓斾笉鎶婁竴娆℃€т笟鍔� UI 杩囨棭鎻愬崌鍒� `shared`銆�

### 涓嬩竴姝�

1. 绛夊緟纭鈥滃紑濮嬫墽琛屸€濆悗锛屽啀鎸� `tasks.md` 浠庡熀绾挎祴璇曞拰鏈€楂橀闄╅〉闈㈠紑濮嬪疄鏂姐€�
2. 浼樺厛澶勭悊 `VideoRemixTaskDetailPage.tsx`銆乣DigitalHumanVideoTasksPage.tsx`銆乣CustomisedAudiosPage.tsx`銆乣DigitalHumansPage.tsx`銆�
3. 姣忓畬鎴愪竴涓〉闈㈡垨涓€涓媶鍒嗘壒娆″悗锛岃繍琛屽搴旈〉闈㈡祴璇曞拰 `npm run typecheck`锛屽苟缁х画鏇存柊鏈繘灞曟枃妗ｃ€�

### 楠岃瘉缁撴灉

- 宸叉墽琛岋細`cmd /c openspec validate split-view-pages-by-feature --strict`
- 缁撴灉锛氶€氳繃锛岃緭鍑� `Change 'split-view-pages-by-feature' is valid`銆�
- 宸叉墽琛岋細`cmd /c openspec status --change "split-view-pages-by-feature"`
- 缁撴灉锛氶€氳繃锛孫penSpec 鏄剧ず `4/4 artifacts complete`銆�
- 灏氭湭杩愯鍓嶇娴嬭瘯锛涙湰闃舵娌℃湁淇敼涓氬姟婧愮爜銆�

---

## 2026-07-07 pages 骞崇骇鐩綍娌荤悊琛ュ厖

### 宸插畬鎴�

- 宸叉牴鎹弽棣堟槑纭湰娆￠噸鐐癸細`src/pages` 褰撳墠鎵€鏈夐〉闈㈠钩绾ф斁缃紝鐩綍褰掑睘涓嶆竻鏅帮紝鍚庣画椤甸潰澧炲鍚庝細褰卞搷鏌ユ壘銆佽矾鐢辩淮鎶ゅ拰妯″潡杈圭晫鍒ゆ柇銆�
- 宸插湪鐜版湁 OpenSpec change `split-view-pages-by-feature` 涓ˉ鍏� pages 鐩綍娌荤悊瑕佹眰锛屾病鏈夊彟璧锋柊 change銆�
- 宸叉洿鏂颁互涓� OpenSpec 鏂囨。锛�
  - `openspec/changes/split-view-pages-by-feature/proposal.md`
  - `openspec/changes/split-view-pages-by-feature/design.md`
  - `openspec/changes/split-view-pages-by-feature/specs/view-page-feature-decomposition/spec.md`
  - `openspec/changes/split-view-pages-by-feature/tasks.md`
- 宸茶ˉ鍏呮帹鑽愮洰褰曟柟鍚戯細
  - `src/pages/auth/`
  - `src/pages/workspace/`
  - `src/pages/content/`
  - `src/pages/digital-human/`
  - `src/pages/points/`
  - `src/pages/system/`

### 褰撳墠鍒ゆ柇

- 鍚庣画鎵ц搴斿厛瑙ｅ喅 `src/pages` 骞崇骇娣蜂贡锛氱Щ鍔ㄩ〉闈㈠埌棰嗗煙瀛愮洰褰曪紝骞舵洿鏂� `src/app/router/routeRegistry.tsx` 鐨� lazy import銆�
- 绗竴闃舵鍙仛椤甸潰鐗╃悊璺緞杩佺Щ锛屼笉鏀瑰彉 route path銆乺oute key銆乺oute meta銆佹潈闄愩€佺紦瀛樺拰鑿滃崟楂樹寒銆�
- 绗簩闃舵鍐嶅鐞嗛〉闈㈠唴閮ㄥ姛鑳芥媶鍒嗭紝鎶婂脊绐椼€佺瓫閫夈€佸垪琛ㄣ€佷笂浼犻瑙堛€佺姸鎬佹槧灏勭瓑涓嬫矇鍒板搴� `features`銆�

### 涓嬩竴姝�

1. 绛夊緟纭鈥滃紑濮嬫墽琛屸€濆悗锛屽厛鐢熸垚褰撳墠 pages 鏂囦欢鍒扮洰鏍囬鍩熺洰褰曠殑杩佺Щ娓呭崟銆�
2. 杩佺Щ椤甸潰鏂囦欢鍜屾祴璇曟枃浠跺悗锛岀珛鍗宠繍琛岃矾鐢辨敞鍐岃〃涓庡熀纭€椤甸潰娴嬭瘯銆�
3. 纭璺敱琛屼负涓嶅彉鍚庯紝鍐嶈繘鍏ラ〉闈㈠唴閮ㄥ姛鑳芥媶鍒嗐€�

### 楠岃瘉缁撴灉

- 宸叉墽琛岋細`cmd /c openspec validate split-view-pages-by-feature --strict`
- 缁撴灉锛氶€氳繃锛岃緭鍑� `Change 'split-view-pages-by-feature' is valid`銆�
- 宸叉墽琛岋細`cmd /c openspec status --change "split-view-pages-by-feature"`
- 缁撴灉锛氶€氳繃锛孫penSpec 鏄剧ず `4/4 artifacts complete`銆�
- 灏氭湭淇敼 `src` 涓氬姟婧愮爜锛屽皻鏈繍琛屽墠绔祴璇曘€�

---

## 2026-07-07 pages 棰嗗煙鐩綍杩佺Щ鎵ц

### 宸插畬鎴�

- 宸叉墽琛� `split-view-pages-by-feature` 绗竴闃舵锛氬皢 `src/pages` 浠庡钩绾ч〉闈㈡枃浠舵暣鐞嗕负娴呭眰棰嗗煙鐩綍銆�
- 褰撳墠 pages 鐩綍宸叉暣鐞嗕负锛�
  - `src/pages/auth/`
  - `src/pages/workspace/`
  - `src/pages/content/`
  - `src/pages/digital-human/`
  - `src/pages/points/`
  - `src/pages/system/`
- 宸插悓姝ユ洿鏂� `src/app/router/routeRegistry.tsx` 鐨� lazy import 璺緞锛屼繚鎸� route path銆乺oute key銆乺oute meta銆乧ache銆乤ctiveMenuKey 鍜屾潈闄愰厤缃笉鍙樸€�
- 宸插悓姝ユ洿鏂� `src/app/App.tsx` 涓� 403/404 椤甸潰瀵煎叆璺緞銆�
- 宸插悓姝ユ洿鏂扮浉鍏� `vitest.*.config.ts` 涓〉闈㈡祴璇� include 璺緞銆�
- 宸蹭慨姝ｇ櫥褰曢〉涓庡綋鍓� `LoginRequest` 绫诲瀷涓嶄竴鑷寸殑闂锛氱櫥褰� payload 浣跨敤 `captchaId`锛屽苟鍚屾鏇存柊鐧诲綍椤垫祴璇曟柇瑷€銆�
- 宸叉洿鏂� `openspec/changes/split-view-pages-by-feature/tasks.md`锛屽嬀閫夋湰闃舵宸插畬鎴愪换鍔★紱椤甸潰鍐呴儴缁勪欢鎷嗗垎浠诲姟浠嶄繚鐣欎负鍚庣画鎵规銆�

### 褰撳墠鍒ゆ柇

- 鏈樁娈靛彧瀹屾垚 pages 鐩綍褰掓。鍜岃矾鐢卞紩鐢ㄨ縼绉伙紝娌℃湁缁х画鎷嗗ぇ椤甸潰鍐呴儴缁勪欢锛岄伩鍏嶄竴娆℃€ф墿澶ф敼鍔ㄩ潰銆�
- 杩佺Щ杩囩▼涓浘鍥� PowerShell 缂栫爜鍐欏叆瀵艰嚧椤甸潰涓枃鍐呭涔辩爜锛屽凡鐢� Git 鍩虹嚎閲嶅缓杩佺Щ鍚庣殑椤甸潰鏂囦欢骞舵仮澶� UTF-8 鍙紪璇戠姸鎬併€傞渶瑕佹敞鎰忥細濡傛灉杩佺Щ鍓嶈繖浜涢〉闈㈤噷鏈夋湭鎻愪氦鐨勬湰鍦板唴瀹规敼鍔紝鍙兘闇€瑕佸悗缁敤鍘嗗彶 diff 鍐嶆牳瀵硅ˉ鍥炪€�
- `routeRegistry.test.ts` 浠嶆湁 2 涓け璐ユ柇瑷€锛屽師鍥犳槸娴嬭瘯鏈熷緟 `workspace.dashboard`銆乣workspace.tasks`銆乣workspace.assets` 宸叉敞鍐岋紝浣嗗綋鍓� `routeRegistry.tsx` 涓繖浜� workspace 璺敱鏈潵灏辨槸娉ㄩ噴鐘舵€侊紱鏈娌℃湁鎿呰嚜鏀瑰彉璺敱涓氬姟琛屼负銆�
- `text-image-video` 鐩稿叧娴嬭瘯浠嶆湁鏃㈡湁涓氬姟棰勬湡涓嶄竴鑷达紝渚嬪榛樿妯″瀷銆丄PI 鍓嶇紑銆丄I 鐢熸垚鏂囨鎸夐挳鍜屼笂浼� input 鏌ヨ锛屼笌鏈鐩綍杩佺Щ鏃犵洿鎺ュ叧绯汇€�

### 涓嬩竴姝�

1. 濡傞渶缁х画鎵ц绗簩闃舵锛屽彲鎸� OpenSpec 浠诲姟浠� `VideoRemixTaskDetailPage.tsx` 寮€濮嬪仛椤甸潰鍐呴儴缁勪欢鎷嗗垎銆�
2. 鍦ㄨ繘鍏ョ浜岄樁娈靛墠锛屽缓璁厛纭鏄惁闇€瑕佹仮澶嶈縼绉诲墠 pages 鏂囦欢閲岀殑鏈彁浜や笟鍔℃敼鍔ㄣ€�
3. 鑻ヨ璁╁叏閮ㄦ祴璇曞彉缁匡紝闇€瑕佸崟鐙鐞� routeRegistry 娴嬭瘯棰勬湡涓庡綋鍓嶆敞閲婅矾鐢辩殑鍏崇郴锛屼互鍙� text-image-video 妯″潡娴嬭瘯涓庡綋鍓嶅疄鐜扮殑宸紓銆�

### 楠岃瘉缁撴灉

- 宸叉墽琛岋細`cmd /c npm run typecheck`
- 缁撴灉锛氶€氳繃銆�
- 宸叉墽琛岋細`cmd /c npm run build`
- 缁撴灉锛氶€氳繃锛孷ite 鎴愬姛鏋勫缓骞剁敓鎴� `dist/` 浜х墿銆�
- 宸叉墽琛岋細`cmd /c npx vitest run --config vitest.login-page-captcha-temp.config.ts`
- 缁撴灉锛氶€氳繃锛�1 涓祴璇曟枃浠躲€�8 涓祴璇曞叏閮ㄩ€氳繃銆�
- 宸叉墽琛岋細`cmd /c openspec validate split-view-pages-by-feature --strict`
- 缁撴灉锛氶€氳繃銆�
- 宸叉墽琛屾湰鍦� Vite 鏈嶅姟 HTTP 璁块棶妫€鏌ワ紝浠ヤ笅璺敱鍧囪繑鍥� HTTP 200锛�
  - `/login`
  - `/image-video/tasks`
  - `/viral-remix/tasks`
  - `/digital-humans`
  - `/customised-audios`
  - `/points/usage-statistics`
  - `/digital-humans/videos`
- Playwright CLI 鐪熷疄娴忚鍣ㄦ鏌ユ湭瀹屾垚锛歚npx playwright --version` 瑙﹀彂 npm 缂撳瓨鐩綍 `EPERM`锛屽綋鍓嶇幆澧冩棤娉曟媺鍙�/鎵ц Playwright 鍖呫€�

---
## 2026-07-07 鍚勬ā鍧楁ā鍨嬮厤缃綅缃⒊鐞�

### 宸插畬鎴�

- 宸叉壂鎻� `src/api`銆乣src/features`銆乣src/pages` 涓笌 `model`銆乣modelType`銆乣targetVideoModel`銆乣promptModel`銆乣videoModel` 鐩稿叧鐨勫瓧娈靛拰椤甸潰浣跨敤鐐广€�
- 宸茬‘璁ゆā鍨嬮粯璁ゅ€间富瑕侀泦涓湪 feature 琛ㄥ崟鏄犲皠灞傦紝鑰屼笉鏄粺涓€閰嶇疆涓績锛�
  - 鏂囧浘鐢熻棰戯細`src/features/text-image-video/form.ts`
  - 瑙嗛杩界垎锛歚src/features/video-remix/form.ts` 涓� `src/pages/content/ViralRemixPage.tsx`
  - 鏁板瓧浜鸿棰戯細`src/features/digital-human/video/form.ts` 涓� `src/pages/digital-human/DigitalHumanVideoTasksPage.tsx`
  - 瀹氬埗闊宠壊锛歚src/features/digital-human/audio/form.ts` 涓� `src/features/digital-human/audio/components.tsx`
- 宸插尯鍒� API 绫诲瀷灞傚拰鐪熷疄璁剧疆灞傦細`src/api/**/types.ts` 鍙畾涔夎姹�/鍝嶅簲瀛楁濂戠害锛屼笉璐熻矗鍐冲畾妯″瀷榛樿鍊笺€�

### 褰撳墠鍒ゆ柇

- 鏂囧浘鐢熻棰戝綋鍓嶉粯璁ゆā鍨嬩负 `dreamina-seedance-2-0`锛屽湪鍒涘缓榛樿鍊笺€佽鎯呭洖濉厹搴曞拰鍒涘缓 payload 鍏滃簳閲岃缃紱椤甸潰娌℃湁妯″瀷閫夋嫨鎺т欢銆�
- 瑙嗛杩界垎褰撳墠榛樿鐩爣妯″瀷涓� `dreamina-seedance-2-0`锛岃鎯呰〃鍗曚繚瀛樻椂寮哄埗浣跨敤璇ラ粯璁ゅ€硷紱璇︽儏椤垫ā鍨嬮€夋嫨 UI 澶勪簬闅愯棌/娉ㄩ噴鐘舵€侊紝鍏ュ彛椤靛垱寤鸿崏绋挎椂涔熷啓鍏ュ悓涓€榛樿妯″瀷銆�
- 鏁板瓧浜鸿棰戝綋鍓嶉粯璁ゆā鍨嬩负鏁板瓧 `1`锛屽垱寤哄脊绐楅珮绾ч€夐」涓睍绀衡€滄ā鍨嬧€濅笅鎷夛紝浣嗙洰鍓嶅彧鏈� `妯″瀷 1锛堥粯璁わ級` 涓€涓€夐」锛涙彁浜� payload 浼氭惡甯� `model: values.model`銆�
- 瀹氬埗闊宠壊褰撳墠榛樿 `modelType` 涓� `tts`銆乣language` 涓� `cn`锛涘綋鍓嶄唬鐮侀噷鐨勫脊绐椾粛灞曠ず妯″瀷绫诲瀷鍜岃绉嶄笅鎷夛紝骞朵笖鍒涘缓 payload 浼氭彁浜� `modelType/language/text`銆傝繖涓� `optimize-customised-audio-create-form` OpenSpec 涓€滃垱寤哄脊绐楅殣钘忔ā鍨嬬被鍨嬪苟涓嶄富鍔ㄦ彁浜も€濈殑鐩爣涓嶅畬鍏ㄤ竴鑷达紝鍚庣画濡傛灉缁х画璇� change锛岄渶瑕佸崟鐙敹鍙ｃ€�
- 鍚庣杩斿洖鐨� `promptModel`銆乣videoModel` 灞炰簬缁撴灉灞曠ず/杩借釜瀛楁锛屽綋鍓嶅墠绔病鏈変富鍔ㄨ缃紱涓昏鍑虹幇鍦ㄨ棰戣拷鐖嗕换鍔＄被鍨嬩笌璇︽儏鐘舵€佸睍绀轰腑銆�

### 涓嬩竴姝�

1. 濡傞渶缁熶竴绠＄悊妯″瀷锛屽缓璁柊澧炶交閲忓父閲忔枃浠舵垨棰嗗煙鍐呭父閲忥紝涓嶈鐩存帴鍋氬叏灞€澶ч厤缃腑蹇冦€�
2. 浼樺厛鎶婃枃鍥剧敓瑙嗛涓庤棰戣拷鐖嗙殑榛樿妯″瀷甯搁噺鍛藉悕瀵煎嚭锛岄伩鍏嶆祴璇曞拰椤甸潰閲岄噸澶嶅啓瀛楃涓层€�
3. 鑻ョ户缁煶鑹茶〃鍗曚紭鍖栵紝搴旀寜 OpenSpec 淇鍒涘缓寮圭獥鍜� payload锛屼娇鍏朵笉鍐嶄富鍔ㄦ彁浜ら殣钘忔ā鍨嬪瓧娈点€�

### 楠岃瘉缁撴灉

- 宸叉墽琛屽彧璇绘壂鎻忥細`rg -n "model|妯″瀷|provider|taskType|generation|engine|preset|template|aiModel|modelName" src openspec doc package.json`
- 宸茬簿璇荤浉鍏宠〃鍗曟槧灏勩€侀〉闈㈠拰 API 绫诲瀷鏂囦欢銆�
- 灏氭湭杩愯娴嬭瘯锛涙湰闃舵鍙仛浠ｇ爜浣嶇疆姊崇悊鍜屾枃妗ｈ褰曘€�

---
---
## 2026-07-07 闊宠壊绠＄悊涔辩爜淇

### 宸插畬鎴�

- 宸插畾浣嶉煶鑹茬鐞嗛〉闈㈠叆鍙ｏ細`src/pages/digital-human/CustomisedAudiosPage.tsx`銆�
- 宸茬‘璁ら〉闈㈠３灞傛枃妗堟湰韬凡鏄甯� UTF-8锛屼贡鐮佷富瑕佹畫鐣欏湪鎷嗗垎鍚庣殑 feature 缁勪欢涓庤〃鍗�/鐘舵€佹槧灏勬枃浠讹細
  - `src/features/digital-human/audio/components.tsx`
  - `src/features/digital-human/audio/form.ts`
  - `src/features/digital-human/audio/status.ts`
- 宸叉仮澶嶉煶鑹茬鐞嗗脊绐椼€佽〃鍗� label銆乸laceholder銆佹牎楠岄敊璇€佹寚鏍囧崱銆佺瓫閫夐」銆佸姞杞芥€併€佺┖鎬併€佸崱鐗囧瓧娈靛悕鍜屾搷浣滄寜閽枃妗堛€�
- 宸插悓姝ョ‘璁� `src/pages/digital-human/CustomisedAudiosPage.test.tsx` 浣跨敤姝ｅ父涓枃鏍蜂緥涓庡彲璁块棶鍚嶇О锛岄伩鍏嶆祴璇曠户缁繚鎶や贡鐮佹枃妗堛€�

### 褰撳墠鍒ゆ柇

- 鏈鏍瑰洜鏄巻鍙叉枃浠跺啓鍏�/璇诲彇閾捐矾閫犳垚鐨勬簮鐮佸彲瑙佷腑鏂囨薄鏌擄紝涓嶆槸闊宠壊绠＄悊鎺ュ彛杩斿洖缂栫爜闂銆�
- 鏈娌℃湁淇敼 API 濂戠害銆丷eact Query hook銆佸垎椤点€佸垱寤恒€佸埛鏂般€佸垹闄ょ瓑涓氬姟琛屼负锛屽彧鍋氶煶鑹茬鐞嗙浉鍏崇敤鎴峰彲瑙佹枃妗堟仮澶嶃€�
- 宸ヤ綔鍖哄師鏈凡鏈� `src/features/text-image-video/form.ts` 鏈彁浜ゆ敼鍔紝鏈娌℃湁瑙︾璇ユ枃浠躲€�

### 涓嬩竴姝�

1. 濡備綘浠嶅湪娴忚鍣ㄧ湅鍒颁贡鐮侊紝浼樺厛娓呯紦瀛�/閲嶅惎 dev server 鍚庡娴� `/customised-audios`銆�
2. 濡傛灉鍏朵粬椤甸潰涔熷嚭鐜板悓绫讳贡鐮侊紝鍙互缁х画鎸夆€滈〉闈㈠叆鍙� -> feature 缁勪欢 -> 娴嬭瘯鏂█鈥濈殑璺緞閫愪釜鏀跺彛銆�
3. 鍚庣画鑻ョ户缁煶鑹插垱寤鸿〃鍗曚紭鍖栵紝鍙彟鎸� `optimize-customised-audio-create-form` 鐨� OpenSpec 鑼冨洿澶勭悊涓婁紶寮忓垱寤鸿〃鍗曪紝涓嶅拰鏈涔辩爜淇娣峰湪涓€璧枫€�

### 楠岃瘉缁撴灉

- 宸叉墽琛屼贡鐮佹畫鐣欐悳绱細`rg -n "闂妡閺倈缂倈閻爘闁竱鐎箌濠瑜皘鐠噟閸檤闁簗閺唡閸抾閹粅閸弢缁爘濡瘄锟絴閳顓爘顣秥顢�" src/pages/digital-human/CustomisedAudiosPage.tsx src/features/digital-human/audio src/pages/digital-human/CustomisedAudiosPage.test.tsx`
- 缁撴灉锛氭湭鍙戠幇娈嬬暀鍖归厤銆�
- 宸叉墽琛岋細`cmd /c npm test -- --config vitest.customised-audios-temp.config.ts`
- 缁撴灉锛氶€氳繃锛�1 涓祴璇曟枃浠躲€�4 涓祴璇曠敤渚嬪叏閮ㄩ€氳繃銆�

---
## 2026-07-07 鏁翠綋椤圭洰涔辩爜淇 OpenSpec 鎷嗚В

### 宸插畬鎴�

- 宸叉寜绯荤粺鎬ц皟璇曟祦绋嬪畬鎴愬叏椤圭洰涔辩爜鍒濇壂锛�
  - `src` 褰撳墠浠呭彂鐜� `src/pages/auth/LoginPage.test.tsx` 涓� 1 澶勬槑鏄� mock 鏂囨涔辩爜銆�
  - `openspec/changes/add-points-usage-statistics-page/tasks.md` 瀛樺湪娲昏穬浠诲姟鏂囨。涔辩爜銆�
  - `openspec/changes/archive/2026-07-03-connect-dynamic-menu-routes/tasks.md` 瀛樺湪褰掓。浠诲姟鏂囨。涔辩爜銆�
  - `doc/2026-07-02-mojibake-audio-menu-progress.md` 淇濈暀鍘嗗彶涔辩爜鏍蜂緥锛屽睘浜庢浘缁忛棶棰樼殑璁板綍锛屼笉涓€瀹氶渶瑕佹敼鍐欍€�
- 宸插垱寤� OpenSpec change锛歚openspec/changes/fix-project-mojibake-text/`銆�
- 宸茬敓鎴愬苟鏍￠獙閫氳繃浠ヤ笅鏂囨。锛�
  - `proposal.md`
  - `design.md`
  - `tasks.md`
  - `specs/project-text-integrity/spec.md`
- 宸叉墽琛岋細`cmd /c openspec validate fix-project-mojibake-text --strict`
- 缁撴灉锛氶€氳繃锛宍Change 'fix-project-mojibake-text' is valid`銆�

### 褰撳墠鍒ゆ柇

- 鏁翠綋涔辩爜淇搴斿垎涓ゆ鎵ц锛氬厛淇繍琛屾椂浠ｇ爜鍜屾祴璇曪紝鍐嶅鐞� OpenSpec/doc 鏂囨。銆�
- 婧愮爜灞傞闄╁緢灏忥紝鐩墠鍙湅鍒扮櫥褰曢〉娴嬭瘯 mock 鏂囨娈嬬暀锛涗笟鍔￠〉闈㈡枃鏈湪鏈鍒濇壂涓病鏈夋柊澧炴槑鏄句贡鐮併€�
- 鏂囨。灞傞渶瑕佽皑鎱庡鐞嗭細娲昏穬 OpenSpec 浠诲姟鏂囨。搴旀仮澶嶅彲璇伙紱褰掓。鍘嗗彶鏂囨。濡傛灉鏃犳硶鍙潬杩樺師锛屼笉搴旂寽娴嬪紡鏀瑰啓銆�
- 褰撳墠宸ヤ綔鍖哄凡鏈夋湭鎻愪氦鏀瑰姩锛屽寘鎷煶鑹茬鐞嗕贡鐮佷慨澶嶅拰 `src/features/text-image-video/form.ts` 鏃㈡湁鏀瑰姩锛涘悗缁墽琛屾椂蹇呴』閬垮紑鏃犲叧鏂囦欢銆�

### 涓嬩竴姝�

1. 绛夊緟鐢ㄦ埛纭鈥滃紑濮嬫墽琛屸€濆悗锛屾寜 `openspec/changes/fix-project-mojibake-text/tasks.md` 瀹炴柦銆�
2. 浼樺厛淇 `src/pages/auth/LoginPage.test.tsx` 涓� C10001 mock 涔辩爜骞惰窇鐧诲綍椤靛畾鍚戞祴璇曘€�
3. 鍐嶆竻鐞嗘椿璺� OpenSpec 鏂囨。涓殑鍙繕鍘熶贡鐮侊紝骞惰褰曟棤娉曡繕鍘熺殑褰掓。娈嬬暀銆�

### 楠岃瘉缁撴灉

- 宸叉墽琛� `rg` 鍒濇壂纭褰撳墠涔辩爜鍒嗗竷銆�
- 宸叉墽琛� OpenSpec 涓ユ牸鏍￠獙骞堕€氳繃銆�
- 灏氭湭鎵ц浠ｇ爜灞備慨澶嶏紱鏈樁娈靛彧瀹屾垚鏂规銆佽鏍间笌浠诲姟鎷嗚В銆�

---
## 2026-07-07 鏁翠綋椤圭洰涔辩爜淇瀹炴柦瀹屾垚

### 宸插畬鎴�

- 宸叉寜 `openspec/changes/fix-project-mojibake-text/tasks.md` 鎵ц鏁翠綋涔辩爜淇銆�
- 宸蹭慨澶� `src/pages/auth/LoginPage.test.tsx` 涓� C10001 mock 娑堟伅涔辩爜锛�
  - 浠庝贡鐮佹枃鏈仮澶嶄负 `璇峰厛淇敼鍒濆瀵嗙爜`銆�
- 宸蹭慨澶嶆椿璺� OpenSpec 鏂囨。锛�
  - `openspec/changes/add-points-usage-statistics-page/tasks.md`
  - 灏嗙Н鍒嗙粺璁￠〉浠诲姟娓呭崟鎭㈠涓烘甯� UTF-8 涓枃锛屽苟淇濈暀鍘熷畬鎴愮姸鎬併€�
- 宸蹭慨澶嶅綊妗� OpenSpec 鏂囨。锛�
  - `openspec/changes/archive/2026-07-03-connect-dynamic-menu-routes/tasks.md`
  - 鏍规嵁鍚岀洰褰� `proposal.md`銆乣design.md`銆乣spec.md` 鍙潬杩樺師浠诲姟璇箟锛屽苟淇濈暀鍘熷畬鎴�/鏈畬鎴愬嬀閫夌姸鎬併€�
- 宸叉洿鏂� `openspec/changes/fix-project-mojibake-text/tasks.md`锛屽嬀閫夊凡瀹屾垚浠诲姟銆�

### 褰撳墠鍒ゆ柇

- `src` 婧愮爜灞傚凡鏃犲綋鍓嶅叧閿瘝鎵弿鍙鐨勬湭瑙ｉ噴涔辩爜娈嬬暀銆�
- 鏂囨。澶嶆壂鍓╀綑鍛戒腑鍧囦负鍙В閲婁繚鐣欙細
  - `fix-project-mojibake-text/tasks.md` 涓殑鎵弿鍛戒护鍏抽敭璇嶃€�
  - `fix-project-mojibake-text/design.md` 涓敤浜庤鏄� mojibake 鐨勭ず渚嬪瓧绗︺€�
  - `doc/2026-07-02-mojibake-audio-menu-progress.md` 涓巻鍙查棶棰樻牱渚� `闂婂疇澹婄粻锛勬倞`锛岀敤浜庤褰曟浘淇杩囩殑闊宠壊鑿滃崟涔辩爜銆�
- 鏈娌℃湁淇敼 API銆佽矾鐢便€丷eact Query hook銆侀〉闈㈢粨鏋勬垨涓氬姟娴佺▼銆�
- 宸ヤ綔鍖轰粛瀛樺湪涓庢湰娆℃棤鍏崇殑鏃㈡湁鏀瑰姩锛屼緥濡� `src/features/text-image-video/form.ts` 涓� `src/pages/content/VideoRemixTasksPage.tsx`锛屾湰娆℃湭鍥為€€涔熸湭绾冲叆澶勭悊銆�

### 涓嬩竴姝�

1. 鑻ュ笇鏈涜繘涓€姝ユ敹绱т贡鐮佹不鐞嗭紝鍙€冭檻鏂板涓€涓交閲忔壂鎻忚剼鏈垨 CI 妫€鏌ワ紝浣嗘湰娆℃湭寮曞叆鏂颁緷璧栥€�
2. 濡傛灉鍚庣画鍙戠幇鏂扮殑椤甸潰涔辩爜锛屽彲鎸夋湰娆℃柟娉曞厛瀹氫綅鐪熷疄鏂囦欢鍐呭锛屽啀鍒嗙被澶勭悊婧愮爜銆佹椿璺冩枃妗ｅ拰鍘嗗彶鏍蜂緥銆�
3. `fix-project-mojibake-text` 宸插畬鎴愶紝鍙湪纭鍚庡綊妗� OpenSpec change銆�

### 楠岃瘉缁撴灉

- 宸叉墽琛� `rg -n "闂妡閺倈缂倈閻爘闁竱鐎箌濠瑜皘鐠噟閸檤闁簗閺唡閸抾閹粅閸弢缁爘濡瘄婢秥瀹竱閳锟絴顓爘顣秥顢�" src --glob '*.{ts,tsx,css,html,json,md}'`
  - 缁撴灉锛氭棤鍛戒腑銆�
- 宸叉墽琛屽叏椤圭洰澶嶆壂锛歚rg -n "闂妡閺倈缂倈閻爘闁竱鐎箌濠瑜皘鐠噟閸檤闁簗閺唡閸抾閹粅閸弢缁爘濡瘄婢秥瀹竱閳锟絴顓爘顣秥顢�" src doc openspec --glob '!doc/progress.md'`
  - 缁撴灉锛氫粎鍓╂壂鎻忓懡浠�/璁捐绀轰緥/鍘嗗彶鏍蜂緥杩欑被鍙В閲婂懡涓€�
- 宸叉墽琛岋細`cmd /c npm test -- --config vitest.login-page-captcha-temp.config.ts`
  - 缁撴灉锛氶€氳繃锛�1 涓祴璇曟枃浠躲€�8 涓祴璇曠敤渚嬪叏閮ㄩ€氳繃銆�
- 宸叉墽琛岋細`cmd /c openspec validate fix-project-mojibake-text --strict`
  - 缁撴灉锛氶€氳繃锛宍Change 'fix-project-mojibake-text' is valid`銆�
---
## 2026-07-07 鏂囦欢闊宠壊涓庢暟瀛椾汉涓婁紶琛ㄥ崟浼樺寲 OpenSpec 鎷嗚В

### 宸插畬鎴�

- 宸叉壂鎻忓綋鍓嶉」鐩粨鏋勶紝纭鎶€鏈爤涓� Vite + React + TypeScript锛孶I 涓昏浣跨敤 Ant Design + TailwindCSS锛屾帴鍙ｇ姸鎬佷娇鐢� TanStack Query銆�
- 宸插畾浣嶈拷鐖嗛〉涓婁紶鍙傝€冨疄鐜帮細`src/pages/content/ViralRemixPage.tsx` 浣跨敤 Ant Design Upload/Dragger 瑙﹀彂涓婁紶锛屽苟璋冪敤 `uploadVideo`銆乣uploadImage` 鍚庢妸杩斿洖 URL 鍐欏叆琛ㄥ崟鐘舵€併€�
- 宸插畾浣嶆枃浠堕煶鑹茬浉鍏冲疄鐜帮細
  - `src/pages/digital-human/CustomisedAudiosPage.tsx`
  - `src/features/digital-human/audio/components.tsx`
  - `src/features/digital-human/audio/form.ts`
- 宸插畾浣嶆暟瀛椾汉鏂板缓寮圭獥鐩稿叧瀹炵幇锛�
  - `src/pages/digital-human/DigitalHumansPage.tsx`
  - `src/features/digital-human/components.tsx`
  - `src/features/digital-human/form.ts`
- 宸插垱寤� OpenSpec change锛歚openspec/changes/optimize-audio-digital-human-upload-forms/`锛屽寘鍚細
  - `proposal.md`
  - `design.md`
  - `tasks.md`
  - `specs/audio-digital-human-upload-forms/spec.md`

### 褰撳墠鍒ゆ柇

- 鏈闇€姹傚睘浜庤法鏂囦欢浜や簰鍜岃〃鍗曞绾︿紭鍖栵紝搴斿厛璧� OpenSpec锛屾殏涓嶇洿鎺ユ敼涓氬姟浠ｇ爜銆�
- 鏂囦欢闊宠壊鏂板缓搴斿彧淇濈暀鍚嶇О鍜岄煶棰戝湴鍧€锛屽叾涓煶棰戝湴鍧€鐢变笂浼犻煶棰戣繑鍥� URL 鍐欏叆锛岄伩鍏嶅洖閫€涓烘墜鍔ㄨ緭鍏ヤ负涓荤殑褰㈡€併€�
- 鏁板瓧浜烘湰鍦拌缁冪礌鏉愬簲鏀逛负鍏堜笂浼犲浘鐗�/瑙嗛锛屽啀灞曠ず涓婁紶缁撴灉锛涘垹闄ゆ椂鍙竻绌哄綋鍓嶈〃鍗曠姸鎬侊紝涓嶅垹闄よ繙绔枃浠舵垨纾佺洏鏂囦欢銆�
- 褰撳墠宸ヤ綔鍖哄凡鏈夊叾浠栨湭鎻愪氦鏀瑰姩锛屾湰娆″彧鏂板 OpenSpec 鏂囨。鍜岃拷鍔犺繘灞曡褰曪紝涓嶅洖閫€鐢ㄦ埛鎴栧巻鍙叉敼鍔ㄣ€�

### 涓嬩竴姝�

1. 绛夊緟纭鈥滃紑濮嬫墽琛屸€濆悗锛屽厛琛ユ祴璇曢攣瀹氳涓猴細鏂囦欢闊宠壊鍙睍绀哄悕绉板拰闊抽涓婁紶锛屾暟瀛椾汉鍥剧墖/瑙嗛涓婁紶鍚庡洖鏄句笖鍙垹闄ゃ€�
2. 鎸� `openspec/changes/optimize-audio-digital-human-upload-forms/tasks.md` 鍒嗘瀹炵幇銆�
3. 瀹炵幇鍚庢洿鏂颁笓棰樿繘灞曟枃妗� `doc/2026-07-07-audio-digital-human-upload-forms-progress.md`锛屾槑纭褰曚笉鍙洖閫€鐐瑰拰楠岃瘉缁撴灉銆�

### 楠岃瘉缁撴灉

- 宸插畬鎴愬彧璇绘壂鎻忓拰 OpenSpec 鏂囨。鍒涘缓銆�
- 灏氭湭杩愯浠ｇ爜娴嬭瘯锛涙湰闃舵鏈慨鏀逛笟鍔′唬鐮併€�

## 2026-07-07 21:55 闊宠壊/鏁板瓧浜轰笂浼犺〃鍗曚紭鍖� - 鍓嶇疆澶嶆牳瀹屾垚

- 宸插畬鎴愶細璇诲彇 OpenSpec change銆佽拷鐖嗛〉涓婁紶瀹炵幇銆佷笂浼� API銆侀煶鑹蹭笌鏁板瓧浜哄垱寤烘帴鍙ｇ被鍨嬶紱纭鏈鑼冨洿鍙鐩栨枃浠堕煶鑹叉柊寤恒€佹暟瀛椾汉鏂板缓鏈湴璁粌绱犳潗涓婁紶/鍥炴樉/鍒犻櫎銆�
- 褰撳墠鍒ゆ柇锛氶」鐩凡鏈� `uploadAudio`銆乣uploadImage`銆乣uploadVideo`锛屾暟瀛椾汉鍒涘缓绫诲瀷宸叉敮鎸� `fileUrl`锛岄煶鑹插垱寤哄瓧娈典粛浣跨敤 `url`銆�
- 涓嬩竴姝ワ細瀹炵幇闊宠壊鍒涘缓涓婁紶寮忚〃鍗曚笌鏁板瓧浜鸿缁冪礌鏉愪笂浼犲紡鍥炴樉銆�
- 楠岃瘉缁撴灉锛氶煶鑹插畾鍚戞祴璇曞凡绾㈢伅锛屽け璐ョ偣绗﹀悎棰勬湡锛氬垱寤哄脊绐椾粛鏄剧ず闅愯棌瀛楁銆佺己灏戜笂浼犵粨鏋滈棴鐜€�

## 2026-07-07 22:05 闊宠壊鍒涘缓涓婁紶琛ㄥ崟 - 瀹炵幇瀹屾垚

- 宸插畬鎴愶細闊宠壊鍒涘缓鎬佸彧淇濈暀鍚嶇О鍜岄煶棰戜笂浼犲叆鍙ｏ紱鎺ュ叆 `uploadAudio`锛涗笂浼犳垚鍔熷洖濉� URL銆佹枃浠跺悕鍜岄煶棰戞挱鏀惧櫒锛涘垹闄ら煶棰戜粎娓呯┖褰撳墠琛ㄥ崟寮曠敤锛涘垱寤� payload 鏀舵暃涓� `{ name, url }`銆�
- 褰撳墠鍒ゆ柇锛氶煶鑹插垱寤轰笉搴斿啀鍥為€€涓烘墜鍔ㄩ煶棰戝湴鍧€杈撳叆锛屼篃涓嶅簲鍐嶆彁浜ゆā鍨嬨€佽绉嶃€佽瘯鍚枃妗堢瓑闅愯棌瀛楁銆�
- 涓嬩竴姝ワ細杩愯闊宠壊瀹氬悜娴嬭瘯骞剁户缁暟瀛椾汉鏈湴璁粌绱犳潗涓婁紶/鍥炴樉/鍒犻櫎瀹炵幇銆�
- 楠岃瘉缁撴灉锛氬緟瀹氬悜娴嬭瘯杈撳嚭銆�

## 2026-07-07 22:08 闊宠壊瀹氬悜楠岃瘉閫氳繃

- 宸插畬鎴愶細淇闊宠壊娴嬭瘯涓殑涔辩爜鏂█鍜岃緭鍏ュ€硷紝纭鍒涘缓寮圭獥涓婁紶寮忔祦绋嬪彲娴嬨€�
- 褰撳墠鍒ゆ柇锛氶煶鑹插垱寤鸿涓哄凡缁忕敱娴嬭瘯鍥哄畾锛屽悗缁笉瑕佸洖閫€涓烘墜鍔ㄩ煶棰戝湴鍧€杈撳叆鎴栭殣钘忓瓧娈垫彁浜ゃ€�
- 涓嬩竴姝ワ細瀹炵幇鏁板瓧浜烘湰鍦拌缁冪礌鏉愪笂浼犮€佸浘鐗�/瑙嗛鍥炴樉銆佸垹闄や笌 `fileUrl` 鍒涘缓鎻愪氦銆�
- 楠岃瘉缁撴灉锛歚cmd /c npm test -- --config vitest.customised-audios-temp.config.ts` 閫氳繃锛�5 涓祴璇曞叏缁匡紱Ant Design 鍦� jsdom 涓嬩粛鏈� getComputedStyle pseudo-elements 鎻愮ず锛屼笉褰卞搷鏂█銆�

## 2026-07-07 22:18 鏁板瓧浜烘湰鍦拌缁冪礌鏉愪笂浼犺〃鍗� - 瀹炵幇瀹屾垚

- 宸插畬鎴愶細鏁板瓧浜烘柊寤哄脊绐楁湰鍦拌缁冪礌鏉愭敼涓� Ant Design Upload.Dragger锛涙牴鎹� MIME 璋� `uploadImage` 鎴� `uploadVideo`锛涗笂浼犳垚鍔熷洖濉� `fileUrl`銆佹枃浠跺悕鍜岀礌鏉愮被鍨嬶紱鍥剧墖/瑙嗛浣跨敤涓婁紶缁撴灉 URL 鍥炴樉锛涘垹闄よ缁冪礌鏉愪粎娓呯┖褰撳墠琛ㄥ崟鐘舵€併€�
- 褰撳墠鍒ゆ柇锛氭暟瀛椾汉鍒涘缓搴旀彁浜や笂浼犲悗鐨� `fileUrl`锛屼笉瑕佸洖閫€涓烘湰鍦� `File` 鐩翠紶锛涘垹闄ゅ悗蹇呴』鎷︽埅鍒涘缓骞舵彁绀洪噸鏂颁笂浼犮€�
- 涓嬩竴姝ワ細杩愯鏁板瓧浜哄畾鍚戞祴璇曪紝淇鍓╀綑娴嬭瘯鏂█鍚庤繘鍏ユ暣浣� typecheck 鍜� OpenSpec 鏍￠獙銆�
- 楠岃瘉缁撴灉锛氬緟瀹氬悜娴嬭瘯杈撳嚭銆�

## 2026-07-07 22:22 鏁板瓧浜哄畾鍚戦獙璇侀€氳繃

- 宸插畬鎴愶細鏁板瓧浜烘湰鍦拌缁冪礌鏉愬浘鐗�/瑙嗛涓婁紶銆佸洖鏄俱€佸垹闄や笌 `fileUrl` 鎻愪氦琛屼负鍧囪娴嬭瘯瑕嗙洊銆�
- 褰撳墠鍒ゆ柇锛氫笂浼犵粨鏋滃洖鏄惧拰鍒犻櫎鍚庝笉鎻愪氦鏃� URL 鏄湰娆￠槻鍥為€€閲嶇偣锛屽悗缁笉鑳芥仮澶嶄负鏈湴 `File` 鐩翠紶鍒涘缓銆�
- 涓嬩竴姝ワ細鏇存柊 OpenSpec tasks銆佷笓棰樿繘灞曟枃妗ｏ紝骞惰繍琛� typecheck 涓� OpenSpec strict 鏍￠獙銆�
- 楠岃瘉缁撴灉锛歚cmd /c npm test -- --config vitest.digital-humans-local-upload-temp.config.ts` 閫氳繃锛�8 涓祴璇曞叏缁匡紱Ant Design jsdom pseudo-elements 鎻愮ず涓嶅奖鍝嶆祴璇曠粨鏋溿€�

## 2026-07-07 22:28 鏂囨。涓� OpenSpec 浠诲姟鏇存柊瀹屾垚

- 宸插畬鎴愶細鏂板涓撻杩涘睍鏂囨。 `doc/2026-07-07-audio-digital-human-upload-forms-progress.md`锛涢噸鍐欏苟鍕鹃€夋湰 change 鐨� `tasks.md` 鍒伴獙璇佸墠鐘舵€侊紱缁х画杩藉姞 `doc/progress.md`銆�
- 褰撳墠鍒ゆ柇锛氳涓鸿竟鐣屽凡缁忓湪 OpenSpec銆佷笓棰樻枃妗ｃ€佹祴璇曚腑涓夊鍥哄畾锛岃兘闄嶄綆鍚庣画璇洖閫€椋庨櫓銆�
- 涓嬩竴姝ワ細鎵ц typecheck 涓� OpenSpec strict 鏍￠獙锛屽繀瑕佹椂淇鏈鐩稿叧绫诲瀷闂銆�
- 楠岃瘉缁撴灉锛氶煶鑹蹭笌鏁板瓧浜哄畾鍚戞祴璇曞凡閫氳繃锛泃ypecheck 鍜� strict 鏍￠獙鎵ц涓€�
