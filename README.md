# quiting-bank

数据存储表
字段名	        数据类型	说明	示例值	是否必填
objectId    	String	系统自动生成的唯一标识符	"5f1a2b3c4d5e6f001a2b3c4d"	是(自动)
user	Pointer → _User	关联的用户对象	{"__type":"Pointer","className":"_User","objectId":"..."}	是
nickname	String	用户昵称	"张三"	是
gender	String	性别	"男"	是
birthday	Date	出生日期	"1990-01-15"	是
education	String	学历	"本科"	是
smokeAge	String	烟龄	"5-10年"	是
smokeCount	String	日均吸烟量	"10-20支"	是
price	Number	常购烟价格	25.5	是
drug	String	是否服用戒烟药	"是"	是
illness	String	是否有基础疾病	"否"	是
slogan	String	戒烟口号	"为了健康，坚决戒烟！"	是
startDate	Date	戒烟开始日期	"2023-10-01"	是
endDate	Date	戒烟结束日期	"2024-01-01"	否
createdAt	Date	创建时间	"2023-09-15T08:30:00.000Z"	是(自动)
updatedAt	Date	最后更新时间	"2023-09-20T10:15:00.000Z"	是(自动)



保存到 LeanCloud 的 AddictionAssessment 表将包含以下字段：

字段名	数据类型	说明
user	Pointer → _User	关联的用户对象
timeIndex	Number	起床后吸烟时间选项索引
q2	Number	问题2的答案
whichIndex	Number	问题3的答案索引
q4	Number	问题4的答案
q5	Number	问题5的答案
score	Number	计算得到的总分
resultLabel	String	结果标签（轻度/中度/重度依赖）
adviceText	String	建议文本
createdAt	Date	创建时间（自动）
updatedAt	Date	更新时间（自动）