
import { sequelizeExample } from '../db'
import configMysql from './mysql'

async function getConfig() {
  const findAll = await configMysql.findAll()
  return findAll
}

async function getConfigValue(key: string) {
	const findAll = await configMysql.findAll()
	if (key && findAll && findAll.length > 0) {
	  let value: null | string = null
	  for (const item of findAll) {
		const json = await item.toJSON()
		if (json.name === key) {
		  value = json.value
		}
	  }
	  return value
	}
	return null
}

async function editConfigs(updatedData: Array<{ [key: string]: any }>) {
  return sequelizeExample.transaction(async (t) => {
    for (const data of updatedData) {
      await configMysql.update(
        { value: data.value },
        { where: { id: data.id, name: data.name }, transaction: t }
      );
    }
  }).then((res) => {
    return { code: 0, data: res }
  }).catch(error => {
    return { code: -1, error }
  });
}

export default {
  getConfig,
  editConfigs,
  getConfigValue
}
