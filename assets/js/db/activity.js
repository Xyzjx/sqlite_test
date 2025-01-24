// activity.js
const initSqlJs = window.initSqlJs;

// 加载数据库
async function loadDatabase() {
    const cachedDb = localStorage.getItem('mlnlpDatabase');
    if (cachedDb) {
        console.log('Using cached database');
        return new initSqlJs.Database(new Uint8Array(JSON.parse(cachedDb)));
    }

    const response = await fetch('db/mlnlp.sqlite'); // 替换为您的数据库文件路径
    const arrayBuffer = await response.arrayBuffer();
    const db = new initSqlJs.Database(new Uint8Array(arrayBuffer));
    localStorage.setItem('mlnlpDatabase', JSON.stringify(arrayBuffer));
    return db;
}

// 根据活动 ID 查询数据
async function getActivityById(id) {
    const db = await loadDatabase();
    const result = db.exec("SELECT * FROM activity WHERE id = ?", [id]);
    if (result.length > 0 && result[0].values.length > 0) {
        return result[0].values[0];
    } else {
        throw new Error(`No activity found with id: ${id}`);
    }
}

// 根据活动类型和活动 ID 查询数据
async function findActivityByActivityTypeAndActivityId(activityType, activityId) {
    const db = await loadDatabase();
    const result = db.exec("SELECT * FROM activity WHERE type = ? AND id = ?", [activityType, activityId]);
    if (result.length > 0 && result[0].values.length > 0) {
        return result[0].values;
    } else {
        throw new Error(`No activity found with type: ${activityType} and id: ${activityId}`);
    }
}

export { getActivityById, findActivityByActivityTypeAndActivityId };