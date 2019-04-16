const { promisify } = require('util')
const sizeOf = promisify(require('image-size'))

const imageDir = './images/mats'

const fs = require('fs')
const path = require('path')

copyImages()

async function copyImages() {
  let images = listFiles(imageDir)
    .filter(name => name.endsWith('.jpg'))
    .map(copyImage)

  images = await Promise.all(images)
  images = {
    items: images
  }
  const result = JSON.stringify(images, null, 2)
  fs.writeFileSync('./public/js/images.json', result, 'utf-8')
}

async function copyImage(imagePath) {
  const dim = await sizeOf(imagePath)
  const contents = fs.readFileSync(imagePath)
  imagePath = imagePath.toLowerCase();
  const outpath = 'public/img/' + path.basename(imagePath)
  fs.writeFileSync(outpath, contents)
  console.log('written', outpath)
  return {
    src: '/img/' + path.basename(imagePath),
    width: dim.width,
    height: dim.height
  }
}

function listFiles(currentDirPath, result = [], recursive = false) {
  fs.readdirSync(currentDirPath).forEach(name => {
    const filePath = path.join(currentDirPath, name)
    const stat = fs.statSync(filePath)
    if (stat.isFile() && !path.basename(filePath).startsWith('.')) {
      result.push(filePath)
    } else if (stat.isDirectory() && recursive) {
      listFiles(filePath, result, true)
    }
  })
  return result
}
