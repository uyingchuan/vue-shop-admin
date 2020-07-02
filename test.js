async function async1() {
  console.log('1')
  console.log(await async2())
  console.log('2')
}
async function async2() {
  console.log('3')
  setTimeout(
    () => console.log('4')
    , 0)
  console.log('5')
}
console.log('6')
setTimeout(function () {
  console.log('7')
}, 0)
console.log(async1())
// new Promise(function (resolve) {
//   console.log('8')
//   resolve()
// }).then(function () {
//   console.log('9')
// })
console.log('10')
