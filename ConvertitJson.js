const XLSX = require("xlsx");
const data = require("./ejemploActualizado.json");
const fs = require("fs");
const { type } = require("os");
let headers = ["id","parent"]

const obtenerHeaders=(obj)=>{
        for (const col_header in obj) {
                const value = obj[col_header];
                if(!headers.includes(col_header)){
                    headers.push(col_header)
                }
                if(typeof value === "object"){
                    obtenerHeaders(value)
                }
        }
}
const convertArrayToObject = (array,parent) => {
    let obj={}
    for (const key in array) {
        array[key].id=id
        array[key].parent=parent
        id++
        if(array[key] instanceof Array && !(array[key] instanceof String) ){

            array[key]=convertArrayToObject(array[key])
        }
        if(array[key] instanceof Object){
            array[key]="REFID "+ array[key].id
            addRow(array[key],id)
        }
        obj[key]=array[key]
    }
    return obj
}
let id = 0
let rows=[]
const addRow = (obj,parent=-1) => {
    console.log(id,parent,obj)
    if(obj === undefined){
        return
    }
    id++
    obj.id=id
    obj.parent=parent
    let row = headers.map(h => "")
    if(obj instanceof Array && !(obj instanceof String)){
        let conversion=convertArrayToObject(obj,id)
        addRow(conversion,parent)
    }
    for(key in obj){
        if(obj instanceof String){
            return
        }
        console.log(key)
        let value = obj[key]
        console.log(value)
        let index= headers.indexOf(key)
        if(value instanceof Array){
            addRow(convertArrayToObject(value,id),id)
            continue
        }else if(value instanceof Object){
            addRow(value,id)
            continue
        }
        row[index]=value
    }
    rows.push(row)
}

const test=[{a:1,b:2,c:3},{a:4,b:5,c:6},{a:7,b:8,c:9}]
obtenerHeaders(test)
addRow(test)
console.log(rows)





const crearExelDesdeArray = (arr) =>{
    var ws = XLSX.utils.aoa_to_sheet(arr);
    const workBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workBook, ws,"pru");
    XLSX.writeFile(workBook, "P.xlsx");
}

crearExelDesdeArray(rows)


// const insertarFilasEnExel = (data,nombre) =>{
//     const workSheet = XLSX.utils.json_to_sheet(data);
//     const workBook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workBook, workSheet,"pru");
//     XLSX.writeFile(workBook, nombre+".xlsx");
//     console.log("logro crea el exel")
// }








const convertirJsonAExcel=(data) =>{
    let rows = []
    for (const row of data) {
        let row_data = []
        getRows(row, row_data)
        rows.push(row_data)
    }
    const result =convertArrayToObject(rows)
    return result
}

// let rows = convertirJsonAExcel(data)
// rows = rows.map(row => {
//     let new_row = {}
//     for (const key in row) {
//         new_row[key] = row[key]
//     }
//     return new_row
// })

// insertarFilasEnExel(rows,"prueba")
// fs.writeFile("newData.json", JSON.stringify(rows), (err) => {
//     if (err) throw err;
//     console.log("The file has been saved!");
// });
// console.log(rows)
// console.log(headers)

module.exports = {convertirJsonAExcel}