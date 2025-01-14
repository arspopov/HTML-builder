const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin, // чтение из консоли
  output: process.stdout, // вывод в консоль
});
console.log('Hi! Input text for write to file.(or "exit" for exit):');
rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    console.log('Bye! Process was ending.');
    rl.close(); // Закрываем readline
    return;
  }

  // Если не exit, тогда записываем в файл
  writeStream.write(input + '\n');
});
rl.on('close', () => {
  console.log('Bye, user!');
  process.exit(0);
});
process.on('SIGINT', () => {
  console.log('\nBye! Process was ending by Ctrl + C.');
  rl.close();
});
