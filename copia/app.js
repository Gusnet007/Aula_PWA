if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/pwa_galaga/sw.js').then((registration) => {
            console.log('Service Worker registrado com sucesso: ', registration.scope);
        }, (err) => {
            console.log('Registro do Service Worker falhou: ', err);
        });
    });
}
var score = 0
var indice_n_sei_mais_qual = 0
// movimentação do personagem e do inimigo
document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const enemy = document.getElementById('enemy');
    const moveLeftButton = document.getElementById('moveLeftButton');
    const moveRightButton = document.getElementById('moveRightButton');
    const fireButton = document.getElementById('fireButton');

    let playerPositionX = 50; // Define a posição X inicial do jogador
    let playerSpeed = 5; // Define a velocidade de movimento do jogador

    // Função para movimentar o jogador
    const movePlayer = (direction) => {
        if (direction === 'left' && playerPositionX > 0) { // Verifica se o jogador está se movendo para a esquerda e se não ultrapassou o limite da tela
            playerPositionX -= playerSpeed; // Move o jogador para a esquerda
        } else if (direction === 'right' && playerPositionX < 100) { // Verifica se o jogador está se movendo para a direita e se não ultrapassou o limite da tela
            playerPositionX += playerSpeed; // Move o jogador para a direita
        }
        player.style.left = `${playerPositionX}%`; // Atualiza a posição horizontal do jogador
    };

    const enemies = [
        { id: 'enemy1', position: 20, direction: 'right', minPosition: 5, maxPosition: 25, speed: 0.25 }, // Inimigo 1
        { id: 'enemy2', position: 50, direction: 'left', minPosition: 45, maxPosition: 60, speed: 0.15 }, // Inimigo 2
        { id: 'enemy3', position: 80, direction: 'right', minPosition: 75, maxPosition: 95, speed: 0.3 } // Inimigo 3
    ];

    // Função para movimentar o inimigo
    function moveEnemies() {
        let aliveEnemies = 0; // Variável para contar inimigos vivos
        enemies.forEach(enemy => {
            // Movimento do inimigo
            if (enemy.direction === 'right') {
                enemy.position += enemy.speed;
            } else {
                enemy.position -= enemy.speed;
            }

            // Limita o movimento do inimigo dentro da área desejada
            if (enemy.position >= enemy.maxPosition) {
                enemy.direction = 'left'; // Inverte a direção quando atinge o limite direito
            } else if (enemy.position <= enemy.minPosition) {
                enemy.direction = 'right'; // Inverte a direção quando atinge o limite esquerdo
            }

            // Atualiza a posição horizontal do inimigo
            document.getElementById(enemy.id).style.left = `${enemy.position}%`;

            // Verifica se o inimigo está vivo
            if (document.getElementById(enemy.id).style.display !== "none") {
                aliveEnemies++;
            }

        });

        // Verifica se não há mais inimigos vivos
        if (aliveEnemies === 0) {
            // Reiniciar o jogo
            location.reload();

            }

    }


    // Move os inimigos automaticamente a cada 50 milissegundos
    setInterval(moveEnemies, 50);


    var carregador = []
    var indice = 0
    const fire = (origin) => {
        var element = document.getElementById('player')
        var pos = element.getBoundingClientRect()
        var x_position = origin;
        // var y_position = innerHeight-227;
        var y_position = pos.y - 10; // 10 = tamanho do 'tiro'
        var shot = document.createElement('div');
        shot.className = "shot"
        shot.id = "shot" + indice
        shot.style.left = `${x_position}%`;
        shot.style.top = `${y_position}px`;
        document.body.appendChild(shot)
        indice++

        let bullet = {
            x: x_position,
            y: y_position,
            name: shot.id
        }

        carregador.push(bullet)

        // Defina uma função para atualizar gradualmente a posição do projétil
        var moveProjectile = () => {
            y_position -= 15; // Ajuste o valor de acordo com a velocidade desejada
            shot.style.top = `${y_position}px`;

            // Verifica se o projétil chegou ao topo
            if (shot.style.top <= `-1px`) {
                clearInterval(intervalId); // Pare de atualizar a posição
                var i = carregador.indexOf(bullet.name) // tirar do array 
                carregador.splice(i, 1)
                var rm_bullet = document.getElementById(bullet.name) // tirar do HTML
                document.body.removeChild(rm_bullet)
            } else {
                // Verifica a colisão com os inimigos
                enemies.forEach(enemy => {
                    var enemyElement = document.getElementById(enemy.id);
                    var enemyRect = enemyElement.getBoundingClientRect();
                    var shotRect = shot.getBoundingClientRect();

                    // Verifica se há colisão entre o tiro e o inimigo
                    if (
                        shotRect.left < enemyRect.right &&
                        shotRect.right > enemyRect.left &&
                        shotRect.top < enemyRect.bottom &&
                        shotRect.bottom > enemyRect.top
                    ) {
                        // Se houver colisão, altere a imagem do inimigo
                        enemyElement.style.backgroundImage = "url('galaga_imgs/explosion1.png')";
                        enemyElement.classList.add('explosion-animation');
                        enemyElement.classList.add('explosion-image'); // Aplica a classe de estilo
                        score += 10
                        document.getElementById('score').innerHTML = score
                        localStorage.setItem('score'+indice_n_sei_mais_qual, score)
                        // Remova o inimigo do documento após um intervalo de tempo
                        clearInterval(enemy.intervalId);

                        // Remova o inimigo do documento após um intervalo de tempo
                        setTimeout(() => {
                            enemyElement.style.display = "none"; // Faz o inimigo desaparecer
                            clearInterval(intervalId); // Para de atualizar a posição do tiro
                            var i = carregador.indexOf(bullet.name); // Remove o tiro da lista de tiros
                            carregador.splice(i, 1);
                            enemyElement.classList.remove('explosion-animation'); // Remove o tiro do documento
                        }, 1000); // Tempo em milissegundos antes do inimigo desaparecer após ser atingido
                    }

                });
            }
        };

        // Chame a função de atualização em intervalos regulares
        var intervalId = setInterval(moveProjectile, 15); // Ajuste o intervalo conforme necessário
    };

    // Adiciona ouvintes de evento para os botões de movimento do jogador e o botão de atirar
    moveLeftButton.addEventListener('click', () => movePlayer('left')); // Chama a função movePlayer quando o botão de mover para a esquerda é clicado
    moveRightButton.addEventListener('click', () => movePlayer('right')); // Chama a função movePlayer quando o botão de mover para a direita é clicado
    fireButton.addEventListener('click', () => fire(playerPositionX)); // Chama a função fire quando o botão de atirar é clicado


});

window.addEventListener('load', () => {
    document.getElementById('login').addEventListener('submit', (event) => {
        event.preventDefault()
        config()
    })
})

function config() {
    document.getElementById('modal').style.display = 'none'
    document.getElementById('overlay').style.display = 'none'
    var nome = document.getElementById('nicknameInput').value
    var count = localStorage.length;
    var encontrado = false
    
    for (let i = 0; i < count; i++) {
        var nickname = localStorage.getItem('nickname' + i)
        if (nome === nickname) {
            encontrado = true
            var indice_ = i
            console.log(indice_)
            break
        }
    }
    if (encontrado) {
        var nickname = localStorage.getItem('nickname' + indice_)
        var score_encontrada = localStorage.getItem('score' + indice_)
        score = parseInt(score_encontrada)
        document.getElementById('nickname').innerHTML = nickname + ':';
        document.getElementById('score').innerHTML = 'Ultima score: ' + score_encontrada;
        indice_n_sei_mais_qual = indice_
    } else {
        let indice_local_storage = localStorage.length
        localStorage.setItem('nickname' + indice_local_storage, nome)
        localStorage.setItem('score' + indice_local_storage, score)
        document.getElementById('nickname').innerHTML = nome + ': ';
        document.getElementById('score').innerHTML = ' ' + score;
        indice_n_sei_mais_qual = indice_local_storage
    }
}

