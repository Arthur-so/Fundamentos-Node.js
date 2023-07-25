// Stream ->

// process.stdin
//     .pipe(process.stdout)

import { Readable } from 'node:stream'

// O comportamento que você observa, com a impressão dos números de 1 a 99 em um loop contínuo,
// ocorre porque o método _read() é chamado repetidamente até que não haja mais dados a serem fornecidos.
// Após a chamada inicial do método _read(), ele será chamado novamente sempre que novos dados forem
// necessários, o que ocorre quando os dados anteriores foram consumidos.
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

// Note que eu recebo os dados antes deles estarem completos
new OneToHundreadStream().pipe(process.stdout)

// Por baixo dos panos, o mecanismo de stream do Node.js envolve um loop
// que chama continuamente o método _read() para fornecer dados à medida
// que são necessários.

// Quando você chama new OneToHundreadStream().pipe(process.stdout),
// está criando uma pipeline de stream em que a saída da instância de
// OneToHundreadStream é redirecionada para o fluxo de saída padrão process.stdout.

// Quando você invoca o método pipe(), o Node.js estabelece uma conexão entre
// a stream de leitura e a stream de escrita. Internamente, ele adiciona um "listener"
// à stream de escrita (no caso, process.stdout), que aguarda o evento data ser
// emitido pela stream de leitura (OneToHundreadStream). Quando o evento data é emitido,
// o listener é acionado e os dados são escritos no fluxo de saída.

// Para fornecer dados à medida que são solicitados, o Node.js utiliza o mecanismo de
// "backpressure" (contrapressão). Quando o fluxo de saída (process.stdout) está pronto
// para receber mais dados, ele emite um sinal de "demand" (demanda) para o fluxo de entrada
// (OneToHundreadStream), indicando que está pronto para consumir mais dados. Em resposta
// a esse sinal, o mecanismo de stream chama o método _read() da classe OneToHundreadStream
// para fornecer novos dados.

// Esse ciclo continua enquanto houver demanda por dados no fluxo de saída e a stream de
// leitura tiver mais dados para fornecer. Quando não há mais dados para fornecer,
// o método _read() deve emitir null para indicar que a stream está esgotada.
