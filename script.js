const btn = document.querySelector('.submit')
let randomNum = 1

btn.addEventListener('click', () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const container = document.querySelector('.container')
    const quote = document.querySelector('.quote').value
    const width = document.querySelector('.width')
    const height = document.querySelector('.height')
    const keyword = document.querySelector('.keyword').value
    const author = document.querySelector('.author').value
    const hexColor = document.querySelector('.hexcolor').value
    const btnDown = document.querySelector('.btn-download')

    if (btnDown != null){
        btn.parentNode.removeChild(btnDown);
    }

    let gradient = ctx.createLinearGradient(0, 0, 170, 100);
    gradient.addColorStop(0, "rgb(255, 0, 128)");
    gradient.addColorStop(1, "rgb(255, 153, 51)");

    // img.src = "https://source.unsplash.com/random/50×50"
    
    canvas.width = '800'
    canvas.height = '600'

    let img = new Image()
    img.crossOrigin="anonymous"
    
    if (keyword.length == 0){
        img.src = `https://source.unsplash.com/random/1000x1000&${randomNum}`
    } else {
        img.src = `https://source.unsplash.com/1600x900/?${keyword}&${randomNum}`
    }

    randomNum ++
    
    wrappedText = getLines(ctx, quote, 75, 75, 175, 40)
    
    img.addEventListener("load", ()=>{
        ctx.drawImage(img,0,0);
        ctx.font = '35px serif';

        if (hexColor.length != 0){
            ctx.fillStyle = hexColor 
        } else {
            ctx.fillStyle = gradient
        }

        
        wrappedText.forEach(function(item) {
            ctx.fillText(item[0], item[1], item[2]);
        })

        if (author.length != 0){
            const lastLine = wrappedText[wrappedText.length - 1][2]
            ctx.fillText(`- ${author}`, 200, lastLine + 60)
        }
    })

    const btnDownload = document.createElement('button')
    btnDownload.innerHTML = '<i class="fa fa-download"></i> Download'
    btnDownload.classList.add('btn')
    btnDownload.classList.add('btn-download')

    container.appendChild(btnDownload)


    btnDownload.addEventListener('click', () => {
        let canvasUrl = canvas.toDataURL()
        
        const createEl = document.createElement('a')
        createEl.href = canvasUrl
        createEl.download = "download-this-canvas"

        createEl.click()
        createEl.remove()
    })
})



// css
// Validation to ensure data is given
// reset after quote generated
// change place of down btn
// allow text size options

function getLines(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = ''
    let testLine = ''
    let lineArray = []

    for (let i = 0; i < words.length; i++) {
        testLine += `${words[i]} `
        let metrics = ctx.measureText(testLine)
        let testWidth = metrics.width
        
        if (testWidth > maxWidth && i > 0) {
            lineArray.push([line, x, y]);
            y += lineHeight;
            line = `${words[i]} `;
            testLine = `${words[i]} `;
        }
        
        else {
            line += `${words[i]} `;
        }

        if (i === words.length - 1) {
            lineArray.push([line, x, y]);
        }
    }
    return lineArray;
}
