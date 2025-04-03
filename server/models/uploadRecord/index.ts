import uploadRecordMysql from './mysql'

async function addUploadRecord(data: { [key: string]: any }) {
  const create = await uploadRecordMysql.create(data)
  return create
}

async function getUploadRecordOne(where) {
	const find = await uploadRecordMysql.findOne({
		where
	})
	if(!find) return null
	return find?.toJSON();
  }

export default {
  addUploadRecord,
  getUploadRecordOne
}
