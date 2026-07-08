## ADDED Requirements

### Requirement: 文件音色新建表单必须只保留必要字段

系统 SHALL 在文件音色新建弹窗中只展示音色名称和音频地址来源，不展示模型类型、语种和试听文案等非当前必要字段。

#### Scenario: 打开文件音色新建弹窗

- **WHEN** 用户点击文件音色页面的新建入口
- **THEN** 系统 MUST 展示音色名称输入项
- **THEN** 系统 MUST 展示音频上传入口或上传结果区域
- **THEN** 系统 MUST NOT 展示模型类型选择
- **THEN** 系统 MUST NOT 展示语种选择
- **THEN** 系统 MUST NOT 展示试听文案输入

### Requirement: 文件音色音频地址必须来自上传结果

系统 SHALL 参考追爆页上传方式，通过项目现有音频上传 API 获取音频 URL，并将该 URL 作为文件音色创建的音频地址。

#### Scenario: 上传音频成功

- **WHEN** 用户在文件音色新建弹窗中选择音频文件
- **THEN** 系统 MUST 调用现有 `uploadAudio` API 上传该文件
- **THEN** 系统 MUST 阻止 Ant Design Upload 默认上传行为
- **THEN** 系统 MUST 在上传成功后展示已上传文件名或已上传状态
- **THEN** 系统 MUST 将上传返回的 URL 写入创建表单的音频地址值

#### Scenario: 删除已上传音频

- **WHEN** 用户点击已上传音频的删除入口
- **THEN** 系统 MUST 清空当前表单中的音频 URL
- **THEN** 系统 MUST 清空当前展示的音频文件名或上传状态
- **THEN** 系统 MUST 回到可重新上传的空态
- **THEN** 系统 MUST NOT 在后续创建请求中提交已删除音频的旧 URL

#### Scenario: 上传音频失败

- **WHEN** 用户选择音频文件后上传失败
- **THEN** 系统 MUST 展示上传失败反馈
- **THEN** 系统 MUST NOT 将失败文件写入表单音频地址值
- **THEN** 系统 MUST 在提交时继续要求有效音频地址

### Requirement: 文件音色创建 payload 必须与表单字段一致

系统 SHALL 在创建文件音色时只主动提交音色名称和音频 URL 对应字段，不主动提交隐藏字段。

#### Scenario: 名称和音频完整时提交

- **WHEN** 用户填写音色名称并成功上传音频后点击提交
- **THEN** 系统 MUST 调用现有创建音色 mutation
- **THEN** 创建 payload MUST 包含音色名称
- **THEN** 创建 payload MUST 包含上传返回的音频 URL 对应字段
- **THEN** 创建 payload MUST NOT 主动包含模型类型字段
- **THEN** 创建 payload MUST NOT 主动包含语种字段
- **THEN** 创建 payload MUST NOT 主动包含试听文案字段

#### Scenario: 缺少名称或音频时提交

- **WHEN** 用户缺少音色名称或未成功上传音频时点击提交
- **THEN** 系统 MUST 阻止创建请求
- **THEN** 系统 MUST 展示对应表单校验反馈

### Requirement: 数字人本地训练素材必须使用上传后结果回显

系统 SHALL 在数字人新建弹窗中使用上传 API 处理本地训练素材，并根据上传结果展示图片或视频回显。

#### Scenario: 上传图片训练素材成功

- **WHEN** 用户在数字人新建弹窗的本地训练素材中选择图片文件
- **THEN** 系统 MUST 调用现有 `uploadImage` API 上传该图片
- **THEN** 系统 MUST 在上传成功后保存返回的 URL
- **THEN** 系统 MUST 展示图片预览
- **THEN** 系统 MUST 展示可识别的已上传状态或文件名

#### Scenario: 上传视频训练素材成功

- **WHEN** 用户在数字人新建弹窗的本地训练素材中选择视频文件
- **THEN** 系统 MUST 调用现有 `uploadVideo` API 上传该视频
- **THEN** 系统 MUST 在上传成功后保存返回的 URL
- **THEN** 系统 MUST 展示视频预览或可播放的视频控件
- **THEN** 系统 MUST 展示可识别的已上传状态或文件名

#### Scenario: 选择不支持的训练素材类型

- **WHEN** 用户选择非图片且非视频的本地训练素材
- **THEN** 系统 MUST 阻止上传
- **THEN** 系统 MUST 展示不支持该文件类型的反馈
- **THEN** 系统 MUST NOT 写入素材 URL

### Requirement: 数字人本地训练素材必须可以手动删除

系统 SHALL 为数字人新建弹窗中的本地训练素材上传结果提供删除入口，并在删除后清空创建表单相关状态。

#### Scenario: 删除已上传图片素材

- **WHEN** 用户点击已上传图片训练素材的删除入口
- **THEN** 系统 MUST 清空图片素材 URL
- **THEN** 系统 MUST 清空素材文件名和素材类型
- **THEN** 系统 MUST 移除图片预览
- **THEN** 系统 MUST 回到可重新上传的空态

#### Scenario: 删除已上传视频素材

- **WHEN** 用户点击已上传视频训练素材的删除入口
- **THEN** 系统 MUST 清空视频素材 URL
- **THEN** 系统 MUST 清空素材文件名和素材类型
- **THEN** 系统 MUST 移除视频预览
- **THEN** 系统 MUST 回到可重新上传的空态

#### Scenario: 删除素材后提交数字人创建

- **WHEN** 用户删除已上传训练素材后点击提交
- **THEN** 系统 MUST 阻止创建请求
- **THEN** 系统 MUST 展示请上传训练素材的校验反馈
- **THEN** 系统 MUST NOT 提交已删除素材的旧 URL

### Requirement: 上传表单优化不得破坏既有页面能力

系统 SHALL 保持文件音色和数字人页面的既有列表、搜索、筛选、分页、刷新、删除、详情跳转和弹窗开关行为不变。

#### Scenario: 使用文件音色列表能力

- **WHEN** 用户在文件音色页面使用搜索、状态筛选、分页、刷新、删除或编辑入口
- **THEN** 系统 MUST 保持与优化前一致的请求参数和交互行为

#### Scenario: 使用数字人列表能力

- **WHEN** 用户在数字人页面使用搜索、状态筛选、分页、刷新、删除或详情跳转
- **THEN** 系统 MUST 保持与优化前一致的请求参数和交互行为

### Requirement: 本地修改必须记录防回退原因

系统 SHALL 在本次上传表单优化的 OpenSpec 和进展文档中记录行为边界，避免后续误把上传结果回显和删除能力回退。

#### Scenario: 完成方案拆解

- **WHEN** 本次优化点完成 OpenSpec 拆解
- **THEN** 系统 MUST 在 change 文档中记录文件音色和数字人上传表单的目标行为
- **THEN** 系统 MUST 在 `doc/progress.md` 中记录当前阶段进展

#### Scenario: 完成代码实现

- **WHEN** 本次优化点完成代码实现和验证
- **THEN** 系统 MUST 更新 `doc/progress.md`
- **THEN** 系统 SHOULD 更新专题进展文档，记录已改文件、验证命令和不可回退点
