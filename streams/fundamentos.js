import { Readable, Writable, Transform } from 'node:stream'


// So' le
class OneToHundreadStream extends Readable {
    index = 1
    

    _read() {
        const i = this.index++
        
        setTimeout(() => {
            if (i > 100) {
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

// Precisa ler dados e escrever
class InverseNumberStream extends Transform {
    /**
     * @param chunck: dado em si (Buffer)
     * @param encoding: como o dado esta' codificado
     * @param callback: funcao chamada quando a stream de escrita terminou de fazer o que queria com o dado 
    */
    _transform(chunk, encoding, callback) {
        const transformed = Number(chunk.toString()) * -1
        callback(null, Buffer.from(String(transformed)))
    }
}


// So escreve
class MultiplyByTenStream extends Writable {
    /**
     * @param chunck: dado em si (Buffer)
     * @param encoding: como o dado esta' codificado
     * @param callback: funcao chamada quando a stream de escrita terminou de fazer o que queria com o dado 
    */
    _write(chunk, encoding, callback) {
        console.log(Number(chunk.toString()) * 10)
        callback()
    }
}



// Note que eu recebo os dados antes deles estarem completos
new OneToHundreadStream()
.pipe(new InverseNumberStream())
.pipe(new MultiplyByTenStream())