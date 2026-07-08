## ADDED Requirements

### Requirement: Source Text Must Be Readable
项目源码与测试中的用户可见中文、mock 消息和可访问名称 SHALL 使用可读 UTF-8 中文，不得残留常见 mojibake 乱码。

#### Scenario: Source scan after cleanup
- **WHEN** 执行针对 `src` 的乱码关键词扫描
- **THEN** 扫描结果 MUST 不包含未解释的乱码残留
- **AND** 若存在刻意保留的历史样例，MUST 在进展文档中说明保留原因

#### Scenario: Related tests remain meaningful
- **WHEN** 修复测试文件中的 mock 文案或断言文本
- **THEN** 测试 MUST 使用正常中文表达业务语义
- **AND** 相关定向测试 MUST 继续通过

### Requirement: Active Planning Documents Must Be Readable
活跃 OpenSpec change 和关键项目进展文档中的任务说明 SHALL 保持可读，不得让乱码阻断后续执行。

#### Scenario: Active OpenSpec cleanup
- **WHEN** 发现活跃 OpenSpec change 的 proposal、design、tasks 或 spec 中存在可可靠还原的乱码
- **THEN** 系统 MUST 将其恢复为正常 UTF-8 中文
- **AND** 该 change MUST 通过 OpenSpec 校验或记录无法校验的原因

#### Scenario: Unrecoverable archived text
- **WHEN** 归档文档或历史进展中的乱码无法从上下文可靠还原
- **THEN** 系统 MUST 不做猜测式改写
- **AND** MUST 在进展文档中记录残留位置、原因和后续处理建议

### Requirement: Cleanup Must Preserve Behavior
乱码修复 SHALL 只改变文本内容或文档说明，不得改变业务行为、接口契约或页面结构。

#### Scenario: No behavior scope expansion
- **WHEN** 完成乱码修复
- **THEN** diff MUST 不包含无关 API、路由、状态流、组件抽象或依赖变更
- **AND** 既有未提交的无关用户改动 MUST 不被覆盖

#### Scenario: Verification before completion
- **WHEN** 声明整体乱码修复完成
- **THEN** MUST 先执行最新的乱码扫描与相关测试
- **AND** MUST 将验证命令和结果写入 `doc/progress.md`
