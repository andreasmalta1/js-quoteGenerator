const btn = document.querySelector('.gen-quote')
let randomNum = 1
let keyword = 'nature'
let clientId = ''

fetch("./data.json")
    .then(response => response.json())
    .then(data => {
        clientId = data.client_id
        console.log(clientId)
    })

btn.addEventListener('click', () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const container = document.querySelector('.container')
    const quoteEl = document.querySelector('.quote')
    const fontSizeEl = document.getElementById('font-size')
    const keywordEl = document.querySelector('.keyword')
    const authorEl = document.querySelector('.author')
    const hexColorEl = document.querySelector('.hexcolor')
    const downloadEl = document.getElementById('downloadbtns')
    const btnNavEL = document.querySelector('.nav-btns')
    const btnEdit = document.getElementById('btn-edit')
    const btnReset = document.getElementById('btn-reset')
    
    const quote = quoteEl.value
    const keywordValue = keywordEl.value
    const author = authorEl.value
    const hexColor = hexColorEl.value
    const fontSize = fontSizeEl.value
    
    if (quote.length == 0){
        return
    }

    while (downloadEl.lastChild) {
        downloadEl.removeChild(downloadEl.lastChild)
    }

    let gradient = ctx.createLinearGradient(0, 0, 170, 100)
    gradient.addColorStop(0, "rgb(255, 0, 128)")
    gradient.addColorStop(1, "rgb(255, 153, 51)")

    canvas.width = window.innerWidth * 0.8
    canvas.height = window.innerHeight

    let img = new Image()
    img.crossOrigin="anonymous"
    
    if (keywordValue.length != 0){
        keyword = keywordValue
    }

    container.style.display = "none";

    const url = `https://api.unsplash.com/photos/random/?orientation=landscape&query=${keyword}&client_id=${clientId}`
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            img.width = canvas.width
            img.height = canvas.height
            img.src = data.urls.regular
            imageLink = data.links.html
            imageId = data.id
            creator = data.user.name
            creator_link = data.user.portfolio_url
        })
        .catch(error => {
            console.log('Error:' + error)
        })

    randomNum ++
    
    wrappedText = getLines(ctx, quote, 75, 75, 175, 40)
    
    img.addEventListener("load", () => {
        canvas.style.display = "block";
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height)
        ctx.font = `${fontSize}px serif`

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
    btnDownload.innerHTML = '<i class="fa fa-download"></i> Download Quote'
    btnDownload.classList.add('btn')
    btnDownload.classList.add('btn-download')
    downloadEl.appendChild(btnDownload)

    btnDownload.addEventListener('click', () => {
        let canvasUrl = canvas.toDataURL()
        
        const createEl = document.createElement('a')
        createEl.href = canvasUrl
        createEl.download = imageId

        createEl.click()
        createEl.remove()
    })

    const btnDownloadOriginal = document.createElement('button')
    btnDownloadOriginal.innerHTML = '<i class="fa fa-download"></i> Download Original Photo'
    btnDownloadOriginal.classList.add('btn')
    btnDownloadOriginal.classList.add('btn-download-original')
    downloadEl.appendChild(btnDownloadOriginal)

    btnDownloadOriginal.addEventListener('click', () => {
        const createEl = document.createElement('a')
        createEl.target = '_blank'
        createEl.href = imageLink
        createEl.click()
        createEl.remove()
    })

    btnNavEL.classList.remove('hidden')

    btnEdit.addEventListener('click', () => {
        container.style.display = "flex"
        // createEl.target = '_blank'
        // createEl.href = creator_link
        // createEl.click()
        // createEl.remove()
    })


    btnReset.addEventListener('click', () => {
        quoteEl.value = ''
        fontSizeEl.value = '32'
        keywordEl.value = ''
        authorEl.value = ''
        hexColorEl.value = ''

        container.style.display = "flex";
        canvas.style.display = "none"
        btnNavEL.style.display = "none"
        downloadEl.style.display = "none"

        document.querySelector('.gen-quote').disabled = true
    })
    
    downloadEl.style.display = "flex"

    const btnArtist = document.createElement('button')
    btnArtist.innerHTML = '<i class="fa fa-download"></i> Go To Artist Portfolio'
    btnArtist.classList.add('btn')
    btnArtist.classList.add('btn-download-original')
    downloadEl.appendChild(btnArtist)

    btnArtist.addEventListener('click', () => {
        const createEl = document.createElement('a')
        createEl.target = '_blank'
        createEl.href = creator_link
        createEl.click()
        createEl.remove()
    })


})

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

function checker() {
    if(document.querySelector('.quote').value==="") { 
        document.querySelector('.gen-quote').disabled = true; 
       } else { 
        document.querySelector('.gen-quote').disabled = false;
       }
   }


// Centre canvas
// after quote hide entry
// arrange width and height of canvas
// arrange buttons to download
// 2 new buttons - edit same image (keep same photo) and start new quote
// Gice credit to user - next to where dowbnload button - first chnage whole layout of display
// css
// change place of down btn
// Fixing canvas sizing issue in mobile
// Design by hand how best to visualize
// how to store api key when deploying