import { Readable } from 'node:stream'

class OneToHundreadStream extends Readable {
    index = 1
    

    _read() {
        const i = this.index++
        
        setTimeout(() => {
            if (i > 5) {
                // push: faz stream fornecer para quem estiver consumindo-a
                this.push(null)
            }
            else {
                const buf = Buffer.from(String(i))
    
                this.push(buf)
            }
        }, 1000)
    }
}


fetch('http://localhost:3334', {
    method: 'POST',
    body: new OneToHundreadStream(),
    duplex: 'half',
})
.then(response => { return response.text() } ) // sempre a primeira promise de fetch sera' uma Reponse
.then(data => { console.log(data) })