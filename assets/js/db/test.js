

const importDBFromFile = (event) => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = toBinArray(e.target.result);
        db = new SQL.Database(data);
        console.log('数据库已导入');
        // let sqlstr = "CREATE TABLE hello (a int, b char); \
        // INSERT INTO hello VALUES (0, 'hello'); \
        // INSERT INTO hello VALUES (1, 'red润'); \
        // INSERT INTO hello VALUES (2, 'world');";
        // db.run(sqlstr); // Run the query without returning anything
        // Prepare an sql statement
        const stmt = db.prepare("SELECT * FROM hello WHERE a=:aval");

        // Bind values to the parameters and fetch the results of the query
        const result = stmt.getAsObject({ ':aval': 0 });
        console.log(result); // Will print {a:2, b:'world'}
    };
    reader.readAsText(file);
};
const exportDBToFile = () => {
    if (!db) {
        console.log("请先导入sqlite数据")
        return
    }
    const exportData = db.export();
    const blob = new Blob([toBinString(exportData)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'database.sqlite';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// or if you are in a browser:
// const initSqlJs = window.initSqlJs;
const toBinArray = (str) => {
    var l = str.length,
        arr = new Uint8Array(l);
    for (var i = 0; i < l; i++) arr[i] = str.charCodeAt(i);
    return arr;
}

const toBinString = (arr) => {
    var uarr = new Uint8Array(arr);
    var strings = [], chunksize = 0xffff;
    // There is a maximum stack size. We cannot call String.fromCharCode with as many arguments as we want
    for (var i = 0; i * chunksize < uarr.length; i++) {
        strings.push(String.fromCharCode.apply(null, uarr.subarray(i * chunksize, (i + 1) * chunksize)));
    }
    return strings.join('');
}
// 在 HTML 中添加文件输入元素
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.sqlite';
fileInput.addEventListener('change', importDBFromFile);
document.body.appendChild(fileInput);
// 添加导出按钮
const button = document.createElement('button');
button.textContent = '导出.sqlite文件';
button.addEventListener('click', exportDBToFile);
document.body.appendChild(button);

const SQL = await initSqlJs({
    // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
    // You can omit locateFile completely when running in node
    locateFile: file => `./dist/${file}`
});
let db = null;