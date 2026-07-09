# 客户用户服务 API


**简介**:客户用户服务 API


**HOST**:http://192.168.77.204:8081


**联系人**:


**Version**:1.0


**接口路径**:/v3/api-docs/default


[TOC]






# 定制音频


## 分页查询定制音频


**接口地址**:`/v1/customised-audios`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>按当前账号分页查询定制音频，可按状态和关键词过滤。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|pageNum|页码，从 1 开始|query|false|integer(int64)||
|pageSize|每页大小|query|false|integer(int64)||
|status|任务状态，可为空|query|false|integer(int32)||
|keyword|名称关键词，可为空|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 创建定制音频


**接口地址**:`/v1/customised-audios`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>提交参考音频，创建定制音频训练任务。</p>



**请求示例**:


```javascript
{
  "name": "品牌音色",
  "url": "",
  "referenceAudioUrl": "",
  "modelType": "",
  "language": "cn",
  "text": "",
  "callback": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|customisedAudioCreateRequest|创建定制音频请求|body|true|CustomisedAudioCreateRequest|CustomisedAudioCreateRequest|
|&emsp;&emsp;name|定制音频名称||true|string||
|&emsp;&emsp;url|Go 兼容 fallback 音频地址||false|string||
|&emsp;&emsp;referenceAudioUrl|参考音频地址，优先级高于 url||false|string||
|&emsp;&emsp;modelType|音频训练模型类型||false|string||
|&emsp;&emsp;language|训练语言，默认 cn||false|string||
|&emsp;&emsp;text|训练参考文本||false|string||
|&emsp;&emsp;callback|OpenSDK 回调地址||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 查询定制音频详情


**接口地址**:`/v1/customised-audios/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据 ID 查询当前账号下的定制音频。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|定制音频 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 删除定制音频


**接口地址**:`/v1/customised-audios/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>逻辑删除定制音频，成功时返回 HTTP 200 和 code=0。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|定制音频 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 刷新定制音频状态


**接口地址**:`/v1/customised-audios/{id}/refresh`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>从远端同步并返回定制音频最新状态。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|定制音频 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


# 健康检查


## 健康检查


**接口地址**:`/healthz`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>返回裸 JSON，不包统一 ApiResponse，兼容 Go user-service 健康检查契约。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK||


**响应参数**:


暂无


**响应示例**:
```javascript

```


# 客户认证


## 获取图形验证码


**接口地址**:`/v1/auth/captcha`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>获取登录验证码，返回验证码 ID 和 PNG Base64。</p>



**请求参数**:


暂无


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 客户登录


**接口地址**:`/v1/auth/login`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>校验手机号、密码和验证码，成功后返回 accessToken 与 refreshToken。</p>



**请求示例**:


```javascript
{
  "phone": "13800000000",
  "password": "Password@123",
  "captchaId": "a1b2c3d4",
  "captchaCode": "8K3P"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|loginRequest|客户登录请求|body|true|LoginRequest|LoginRequest|
|&emsp;&emsp;phone|手机号 / 登录账号||true|string||
|&emsp;&emsp;password|登录密码||true|string||
|&emsp;&emsp;captchaId|验证码标识，由获取验证码接口返回||true|string||
|&emsp;&emsp;captchaCode|验证码文本||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 客户登出


**接口地址**:`/v1/auth/logout`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>将当前 Authorization Bearer Token 加入黑名单，body 可为空。</p>



**请求示例**:


```javascript
{
  "accessToken": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|logoutRequest|登出请求；当前服务实际以 Authorization Header 中的 Bearer Token 为准，body 可为空|body|true|LogoutRequest|LogoutRequest|
|&emsp;&emsp;accessToken|兼容旧契约的 accessToken 字段，可不传||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 修改密码


**接口地址**:`/v1/auth/password`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>校验旧密码后修改新密码，并让旧 token 失效。</p>



**请求示例**:


```javascript
{
  "oldPassword": "OldPassword@123",
  "newPassword": "NewPassword@123"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|changePasswordRequest|修改密码请求|body|true|ChangePasswordRequest|ChangePasswordRequest|
|&emsp;&emsp;oldPassword|旧密码||true|string||
|&emsp;&emsp;newPassword|新密码，需要满足密码复杂度规则||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 刷新令牌


**接口地址**:`/v1/auth/refresh`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>使用 refreshToken 换发新的 accessToken 与 refreshToken。</p>



**请求示例**:


```javascript
{
  "refreshToken": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|refreshTokenRequest|刷新令牌请求|body|true|RefreshTokenRequest|RefreshTokenRequest|
|&emsp;&emsp;refreshToken|刷新令牌||true|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


# 客户上传


## 上传音频文件


**接口地址**:`/v1/uploads/audio`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>上传音频素材，支持 Go 兼容路径 <code>/user-api/aigc/uploads/audio</code>。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|file|音频文件|query|false|file||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 上传图片文件


**接口地址**:`/v1/uploads/image`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>上传图片素材，支持 Go 兼容路径 <code>/user-api/aigc/uploads/image</code>。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|file|图片文件|query|false|file||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 上传视频文件


**接口地址**:`/v1/uploads/video`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>上传视频素材，支持 Go 兼容路径 <code>/user-api/aigc/uploads/video</code>。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|file|视频文件|query|false|file||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


# 视频追爆任务


## 分页查询视频追爆任务


**接口地址**:`/v1/video-remix-tasks`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>按当前账号分页查询视频追爆任务。状态：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|pageNum|页码，从 1 开始|query|false|integer(int64)||
|pageSize|每页大小|query|false|integer(int64)||
|status|视频追爆状态，可为空|query|false|integer(int32)||
|keyword|名称关键词，可为空|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 创建视频追爆草稿


**接口地址**:`/v1/video-remix-tasks`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>创建视频追爆草稿任务，后续可保存表单并逐步生成内容。</p>



**请求示例**:


```javascript
{
  "title": "新品口播视频",
  "name": "新品口播视频",
  "remark": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|videoRemixCreateRequest|视频追爆草稿创建请求|body|true|VideoRemixCreateRequest|VideoRemixCreateRequest|
|&emsp;&emsp;title|Go 端兼容的任务标题字段，会映射到 name||false|string||
|&emsp;&emsp;name|Java 端任务名称字段||false|string||
|&emsp;&emsp;remark|任务备注||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 查询视频追爆详情


**接口地址**:`/v1/video-remix-tasks/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据 ID 查询当前账号下的视频追爆任务。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|视频追爆任务 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 删除视频追爆任务


**接口地址**:`/v1/video-remix-tasks/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>逻辑删除视频追爆任务，成功时返回 HTTP 200 和 code=0。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|视频追爆任务 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 检查视频追爆 Prompt


**接口地址**:`/v1/video-remix-tasks/{id}/check-prompt`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>检查当前 Prompt 是否可用于后续视频生成。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|视频追爆任务 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 保存视频追爆表单


**接口地址**:`/v1/video-remix-tasks/{id}/form`


**请求方式**:`PUT`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>保存参考视频、商品图片、人物图片、旁白、Prompt 等表单内容。</p>



**请求示例**:


```javascript
{
  "name": "新品口播视频",
  "remark": "",
  "targetVideoModel": "wan2.7-r2v",
  "referenceVideoUrl": "",
  "videoMetaSummary": "",
  "productImageUrls": {},
  "characterImageUrls": {},
  "audioUrl": "",
  "productInfo": "",
  "prompt": "",
  "voiceoverScript": "",
  "direction": "",
  "generationDuration": 15,
  "callback": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|视频追爆任务 ID|path|true|integer(int64)||
|videoRemixFormRequest|视频追爆表单保存请求|body|true|VideoRemixFormRequest|VideoRemixFormRequest|
|&emsp;&emsp;name|任务名称||false|string||
|&emsp;&emsp;remark|任务备注||false|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型||false|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址||false|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要||false|string||
|&emsp;&emsp;productImageUrls|人物图片地址，兼容 JSON array 或 JSON string||false|JsonNode|JsonNode|
|&emsp;&emsp;characterImageUrls|人物图片地址，兼容 JSON array 或 JSON string||false|JsonNode|JsonNode|
|&emsp;&emsp;audioUrl|参考音频地址||false|string||
|&emsp;&emsp;productInfo|商品信息文本||false|string||
|&emsp;&emsp;prompt|视频生成 Prompt||false|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本||false|string||
|&emsp;&emsp;direction|视频方向或创意方向||false|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒||false|integer(int32)||
|&emsp;&emsp;callback|远端回调地址||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 执行视频追爆聚合生成


**接口地址**:`/v1/video-remix-tasks/{id}/generate`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>按服务编排执行商品信息、Prompt、旁白脚本和视频生成流程。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|视频追爆任务 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 生成商品信息


**接口地址**:`/v1/video-remix-tasks/{id}/generate-product-info`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据表单中的素材生成或完善视频追爆商品信息。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|视频追爆任务 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 生成视频追爆 Prompt


**接口地址**:`/v1/video-remix-tasks/{id}/generate-prompt`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据当前表单内容生成视频追爆 Prompt。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|视频追爆任务 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 提交视频生成


**接口地址**:`/v1/video-remix-tasks/{id}/generate-video`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>提交远端视频生成任务，并返回最新视频追爆任务信息。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|视频追爆任务 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 生成旁白脚本


**接口地址**:`/v1/video-remix-tasks/{id}/generate-voiceover-script`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据商品信息和 Prompt 生成视频追爆旁白脚本。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|视频追爆任务 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 刷新视频追爆状态


**接口地址**:`/v1/video-remix-tasks/{id}/refresh`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>从远端同步并返回视频追爆任务最新状态。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|视频追爆任务 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


# 数字人视频


## 分页查询数字人视频


**接口地址**:`/v1/digital-person-videos`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>按当前账号分页查询数字人视频，可按状态和关键词过滤。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|pageNum|页码，从 1 开始|query|false|integer(int64)||
|pageSize|每页大小|query|false|integer(int64)||
|status|任务状态，可为空|query|false|integer(int32)||
|keyword|名称关键词，可为空|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 创建数字人视频


**接口地址**:`/v1/digital-person-videos`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>基于数字人形象和文本或音频驱动创建视频生成任务。</p>



**请求示例**:


```javascript
{
  "name": "商品讲解视频",
  "personId": 1,
  "type": "tts",
  "text": "",
  "customAudioId": 1,
  "audioManId": "",
  "fileId": "",
  "wavUrl": "",
  "screenWidth": 1080,
  "screenHeight": 1920,
  "x": 0,
  "y": 0,
  "personWidth": 720,
  "personHeight": 1280,
  "removedBg": false,
  "speed": 1,
  "pitch": 1,
  "volume": 100,
  "language": "cn",
  "model": "",
  "callback": "",
  "addComplianceWatermark": false,
  "complianceWatermarkPosition": "",
  "resolutionRate": 1,
  "bg": {},
  "subtitleConfig": {},
  "bgColor": "#EDEDED"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|digitalPersonVideoCreateRequest|创建数字人视频请求|body|true|DigitalPersonVideoCreateRequest|DigitalPersonVideoCreateRequest|
|&emsp;&emsp;name|数字人视频任务名称||true|string||
|&emsp;&emsp;personId|本地数字人形象 ID，必须归属当前账号且已就绪||true|integer(int64)||
|&emsp;&emsp;type|生成类型，默认 tts，仅允许 tts 或 audio||false|string||
|&emsp;&emsp;text|TTS 文本，type=tts 时必填||false|string||
|&emsp;&emsp;customAudioId|本地定制音频 ID，传入时必须归属当前账号且未删除||false|integer(int64)||
|&emsp;&emsp;audioManId|远端音色 ID||false|string||
|&emsp;&emsp;fileId|远端文件 ID||false|string||
|&emsp;&emsp;wavUrl|音频驱动地址，type=audio 时必填||false|string||
|&emsp;&emsp;screenWidth|画布宽度||false|integer(int32)||
|&emsp;&emsp;screenHeight|画布高度||false|integer(int32)||
|&emsp;&emsp;x|数字人左上角横坐标||false|integer(int32)||
|&emsp;&emsp;y|数字人左上角纵坐标||false|integer(int32)||
|&emsp;&emsp;personWidth|数字人渲染宽度||false|integer(int32)||
|&emsp;&emsp;personHeight|数字人渲染高度||false|integer(int32)||
|&emsp;&emsp;removedBg|是否移除数字人背景||false|boolean||
|&emsp;&emsp;speed|语速倍率||false|number||
|&emsp;&emsp;pitch|音调倍率||false|number||
|&emsp;&emsp;volume|音量||false|integer(int32)||
|&emsp;&emsp;language|生成语言，默认 cn||false|string||
|&emsp;&emsp;model|生成模型||false|string||
|&emsp;&emsp;callback|OpenSDK 回调地址||false|string||
|&emsp;&emsp;addComplianceWatermark|是否添加合规水印||false|boolean||
|&emsp;&emsp;complianceWatermarkPosition|合规水印位置||false|string||
|&emsp;&emsp;resolutionRate|分辨率倍率||false|integer(int32)||
|&emsp;&emsp;bg|人物图片地址，兼容 JSON array 或 JSON string||false|JsonNode|JsonNode|
|&emsp;&emsp;subtitleConfig|人物图片地址，兼容 JSON array 或 JSON string||false|JsonNode|JsonNode|
|&emsp;&emsp;bgColor|默认背景颜色||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 查询数字人视频详情


**接口地址**:`/v1/digital-person-videos/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据 ID 查询当前账号下的数字人视频。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|数字人视频 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 删除数字人视频


**接口地址**:`/v1/digital-person-videos/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>逻辑删除数字人视频，成功时返回 HTTP 200 和 code=0。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|数字人视频 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 刷新数字人视频状态


**接口地址**:`/v1/digital-person-videos/{id}/refresh`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>从远端同步并返回数字人视频最新状态。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|数字人视频 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


# 数字人形象


## 分页查询数字人形象


**接口地址**:`/v1/digital-persons`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>按当前账号分页查询数字人形象，可按状态和关键词过滤。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|pageNum|页码，从 1 开始|query|false|integer(int64)||
|pageSize|每页大小|query|false|integer(int64)||
|status|任务状态，可为空|query|false|integer(int32)||
|keyword|名称关键词，可为空|query|false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 创建数字人形象


**接口地址**:`/v1/digital-persons`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>提交训练素材，创建数字人形象训练任务。</p>



**请求示例**:


```javascript
{
  "name": "品牌主播",
  "fileUrl": "https://cdn.example.com/person.mp4",
  "voiceId": "",
  "trainType": "",
  "language": "cn",
  "errorSkip": false,
  "resolutionRate": 1,
  "callback": ""
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|digitalPersonCreateRequest|创建数字人形象请求|body|true|DigitalPersonCreateRequest|DigitalPersonCreateRequest|
|&emsp;&emsp;name|数字人形象名称||true|string||
|&emsp;&emsp;fileUrl|训练素材文件地址||true|string||
|&emsp;&emsp;voiceId|Go 兼容音色字段，对应本地 audioManId||false|string||
|&emsp;&emsp;trainType|数字人训练类型||false|string||
|&emsp;&emsp;language|训练语言，默认 cn||false|string||
|&emsp;&emsp;errorSkip|训练失败时是否跳过可忽略错误||false|boolean||
|&emsp;&emsp;resolutionRate|分辨率倍率||false|integer(int32)||
|&emsp;&emsp;callback|OpenSDK 回调地址||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 查询数字人形象详情


**接口地址**:`/v1/digital-persons/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据 ID 查询当前账号下的数字人形象。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|数字人形象 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 删除数字人形象


**接口地址**:`/v1/digital-persons/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>逻辑删除数字人形象，成功时返回 HTTP 200 和 code=0。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|数字人形象 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 刷新数字人形象状态


**接口地址**:`/v1/digital-persons/{id}/refresh`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>从远端同步并返回数字人形象最新状态。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|数字人形象 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


# 文图生视频任务


## 分页查询文图生视频任务


**接口地址**:`/v1/text-image-video/tasks`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>按当前登录账号分页查询文图生视频任务。状态：0 草稿，1 生成中，2 成功，3 失败，4 系统错误，99 已删除。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|pageNum|页码，从 1 开始|query|false|integer(int64)||
|pageSize|每页大小|query|false|integer(int64)||
|status|任务状态，可为空|query|false|integer(int32)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 创建文图生视频任务


**接口地址**:`/v1/text-image-video/tasks`


**请求方式**:`POST`


**请求数据类型**:`application/x-www-form-urlencoded,application/json`


**响应数据类型**:`*/*`


**接口描述**:<p>提交图片地址和提示词，创建文图生视频生成任务。</p>



**请求示例**:


```javascript
{
  "imageUrls": [
    "https://cdn.example.com/image1.png"
  ],
  "prompt": "让图片中的人物自然走动",
  "model": "seedance2.0",
  "negativePrompt": "低清晰度，变形"
}
```


**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|textImageVideoCreateRequest|创建文图生视频任务请求|body|true|TextImageVideoCreateRequest|TextImageVideoCreateRequest|
|&emsp;&emsp;imageUrls|图片地址列表||true|array|string|
|&emsp;&emsp;prompt|生成提示词||true|string||
|&emsp;&emsp;model|生成模型，不传时服务使用默认模型||false|string||
|&emsp;&emsp;negativePrompt|负向提示词||false|string||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 查询文图生视频任务详情


**接口地址**:`/v1/text-image-video/tasks/{id}`


**请求方式**:`GET`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>根据任务 ID 查询当前账号下的文图生视频任务。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|任务 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```


## 删除文图生视频任务


**接口地址**:`/v1/text-image-video/tasks/{id}`


**请求方式**:`DELETE`


**请求数据类型**:`application/x-www-form-urlencoded`


**响应数据类型**:`*/*`


**接口描述**:<p>逻辑删除任务，成功时返回 HTTP 200 和 code=0。</p>



**请求参数**:


| 参数名称 | 参数说明 | 请求类型    | 是否必须 | 数据类型 | schema |
| -------- | -------- | ----- | -------- | -------- | ------ |
|id|任务 ID|path|true|integer(int64)||


**响应状态**:


| 状态码 | 说明 | schema |
| -------- | -------- | ----- | 
|200|OK|ApiResponse|


**响应参数**:


| 参数名称 | 参数说明 | 类型 | schema |
| -------- | -------- | ----- |----- | 
|code|业务响应码，成功固定为 0|string||
|data||VideoRemixTaskResponse|VideoRemixTaskResponse|
|&emsp;&emsp;id|视频追爆任务主键|integer(int64)||
|&emsp;&emsp;accountId|客户账号 ID|integer(int64)||
|&emsp;&emsp;userId|客户用户 ID|integer(int64)||
|&emsp;&emsp;name|任务名称|string||
|&emsp;&emsp;title|Go 端兼容标题字段，与 name 保持一致|string||
|&emsp;&emsp;remark|任务备注|string||
|&emsp;&emsp;targetVideoModel|目标视频生成模型|string||
|&emsp;&emsp;referenceVideoUrl|参考视频地址|string||
|&emsp;&emsp;videoMetaSummary|参考视频元信息摘要|string||
|&emsp;&emsp;productImageUrls|商品图片地址列表|array|string|
|&emsp;&emsp;characterImageUrls|人物图片地址列表|array|string|
|&emsp;&emsp;productImageUrlsJson|商品图片地址 JSON 数组字符串|string||
|&emsp;&emsp;characterImageUrlsJson|人物图片地址 JSON 数组字符串|string||
|&emsp;&emsp;audioUrl|参考音频地址|string||
|&emsp;&emsp;productInfo|商品信息文本|string||
|&emsp;&emsp;prompt|视频生成 Prompt|string||
|&emsp;&emsp;voiceoverScript|视频旁白脚本文本|string||
|&emsp;&emsp;direction|视频方向或创意方向|string||
|&emsp;&emsp;generationDuration|生成视频时长，单位秒|integer(int32)||
|&emsp;&emsp;status|视频追爆任务状态码：0 草稿，1 Prompt 已生成，2 Prompt 通过，3 Prompt 拒绝，4 视频生成中，5 成功，6 失败，7 系统错误，99 已删除|integer(int32)||
|&emsp;&emsp;statusLabel|视频追爆任务状态中文文案|string||
|&emsp;&emsp;progress|远端生成进度百分比|integer(int32)||
|&emsp;&emsp;videoUrl|生成后的视频地址|string||
|&emsp;&emsp;resultUrl|Go 端兼容结果地址字段，与 videoUrl 保持一致|string||
|&emsp;&emsp;coverUrl|生成后的视频封面地址|string||
|&emsp;&emsp;duration|生成后的视频时长，单位秒|integer(int32)||
|&emsp;&emsp;remoteTaskId|远端 AIGC 服务任务 ID|string||
|&emsp;&emsp;externalTaskId|外部系统任务 ID|string||
|&emsp;&emsp;errorMessage|远端返回的错误消息|string||
|&emsp;&emsp;errReason|Go 端兼容错误原因字段|string||
|&emsp;&emsp;errorMsg|Go 端兼容错误消息字段|string||
|&emsp;&emsp;syncError|同步远端状态时记录的异常信息|string||
|&emsp;&emsp;callback|远端回调地址|string||
|&emsp;&emsp;createTime|创建时间|string(date-time)||
|&emsp;&emsp;updateTime|更新时间|string(date-time)||
|message|错误消息，成功时不返回|string||


**响应示例**:
```javascript
{
	"code": "0",
	"data": {
		"id": 1,
		"accountId": 1001,
		"userId": 1,
		"name": "",
		"title": "",
		"remark": "",
		"targetVideoModel": "wan2.7-r2v",
		"referenceVideoUrl": "",
		"videoMetaSummary": "",
		"productImageUrls": [],
		"characterImageUrls": [],
		"productImageUrlsJson": "",
		"characterImageUrlsJson": "",
		"audioUrl": "",
		"productInfo": "",
		"prompt": "",
		"voiceoverScript": "",
		"direction": "",
		"generationDuration": 15,
		"status": 5,
		"statusLabel": "",
		"progress": 100,
		"videoUrl": "",
		"resultUrl": "",
		"coverUrl": "",
		"duration": 15,
		"remoteTaskId": "",
		"externalTaskId": "",
		"errorMessage": "",
		"errReason": "",
		"errorMsg": "",
		"syncError": "",
		"callback": "",
		"createTime": "",
		"updateTime": ""
	},
	"message": "未登录或登录已过期"
}
```