import installedPluginMysql from './mysql'

async function getInstalledPluginLog(where?: { [key: string]: any }) {
  const finds = await installedPluginMysql.findOne({
    where: {
      ...where
    }
  })
  return finds
}

async function addInstalledPlugin(data?: { [key: string]: any }) {
  const create = await installedPluginMysql.create({
    ...data
  })
  return create
}

async function editInstalledPlugin(data: { [key: string]: any }, where: { [key: string]: any }) {
  const update = await installedPluginMysql.update(data, {
    where: where
  })
  return update
}

async function getInstalledPluginCount(where: { [key: string]: any }) {
  const findCount = await installedPluginMysql.findAndCountAll({
    where: {
      ...where
    }
  })
  return findCount
}

async function getUserInstalledPluginIds(user_id: number | string, where?: { [key: string]: any }, id?: boolean) {
  const find = await installedPluginMysql.findAll({
    where: {
      user_id,
      status: 1,
      ...where
    }
  })
  if(id) {
	const ids = find.map(item => item.toJSON()).map(item => item.plugin_id)
	return ids
  }
  return find
}

export default {
  getInstalledPluginLog,
  addInstalledPlugin,
  editInstalledPlugin,
  getUserInstalledPluginIds,
  getInstalledPluginCount
}
