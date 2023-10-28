const taskButtons = document.querySelectorAll('.task-button');
let selectedButton = null;

// Adicione um ouvinte de clique a cada botão
taskButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        // Verifique se o botão já possui a classe active
        if (event.currentTarget === selectedButton) {
            // Se o botão clicado é o mesmo que já está selecionado, desative-o
            selectedButton.classList.remove('active');
            selectedButton = null;
        } else {
            // Se não estiver ativo, ative o botão e desative o anterior, se houver
            if (selectedButton) {
                selectedButton.classList.remove('active');
            }
            event.currentTarget.classList.add('active');
            selectedButton = event.currentTarget;
        }
    });
});