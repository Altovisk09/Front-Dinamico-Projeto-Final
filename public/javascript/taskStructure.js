document.addEventListener('DOMContentLoaded', function () {

  function formatDate(date) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(date).toLocaleDateString('pt-BR', options);
  }

  function async renderTask(tasks, project, state) {
    tasks.forEach(task => {
      if (task.state === state) {
        project.members.forEach((member, memberIndex) => {
          if (member === task.creator) {
            // taskCard
            const taskCard = document.createElement('div');
            taskCard.className = `md-4 task-color-${memberIndex}`;
            taskCard.id = 'taskCard';

            // cardHeader
            const cardHeader = document.createElement('div');
            cardHeader.id = 'card-header';

            // cardTitle
            const cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = task.name;

            // creatorCircle
            const creatorCircle = document.createElement('div');
            creatorCircle.className = `creator-circle creator-color-${memberIndex}`;
            creatorCircle.textContent = task.creator.charAt(0).toUpperCase();

            cardHeader.appendChild(cardTitle);
            cardHeader.appendChild(creatorCircle);

            // cardContent
            const cardContent = document.createElement('div');
            cardContent.id = 'card-content';

            // cardText
            const cardText = document.createElement('p');
            cardText.className = 'card-text';
            cardText.textContent = task.description.length > 80 ? task.description.slice(0, 80) + '...' : task.description;

            cardContent.appendChild(cardText);

            // cardFooter
            const cardFooter = document.createElement('div');
            cardFooter.id = 'card-footer';

            // botões
            const taskButtons = document.createElement('div');
            taskButtons.id = 'taskButtons';


            const primaryButton = document.createElement('button');
            primaryButton.className = 'btn btn-primary rounded-circle task-button';
            const primaryButtonIcon = document.createElement('i');
            primaryButtonIcon.className = 'bi bi-caret-right-fill';
            primaryButton.appendChild(primaryButtonIcon);

            const secondaryButton = document.createElement('button');
            secondaryButton.className = 'btn btn-secondary rounded-circle task-button';
            const secondaryButtonIcon = document.createElement('i');
            secondaryButtonIcon.className = 'bi bi-chat-left-text-fill';
            secondaryButton.appendChild(secondaryButtonIcon);

            // dropdown
            const dropdown = document.createElement('div');
            dropdown.className = 'btn-group';

            const dropdownButton = document.createElement('button');
            dropdownButton.className = 'btn btn-secondary rounded-circle task-button';
            dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
            dropdownButton.setAttribute('aria-expanded', 'false');
            const dropdownButtonIcon = document.createElement('i');
            dropdownButtonIcon.className = 'bi bi-three-dots';
            dropdownButton.appendChild(dropdownButtonIcon);

            const dropdownMenu = document.createElement('ul');
            dropdownMenu.className = 'dropdown-menu';

            const editItem = createDropdownItem('Editar Tarefa', '#');
            const deleteItem = createDropdownItem('Excluir Tarefa', '#');

            const verMaisItem = document.createElement('li');
            verMaisItem.innerHTML = `<a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#taskDescriptionModal${task._id}">Ver Mais</a>`;

            dropdownMenu.appendChild(editItem);
            dropdownMenu.appendChild(deleteItem);
            dropdownMenu.appendChild(verMaisItem);

            dropdown.appendChild(dropdownButton);
            dropdown.appendChild(dropdownMenu);

            // deadlineBackground
            const deadlineBackground = document.createElement('div');
            deadlineBackground.id = 'deadlineBackground';

            // cardDeadline
            const cardDeadline = document.createElement('p');
            cardDeadline.className = 'card-text';
            cardDeadline.textContent = formatDate(task.deadline);

            deadlineBackground.appendChild(cardDeadline);

            // Anexa os elementos ao taskCard
            cardFooter.appendChild(taskButtons);
            taskButtons.appendChild(primaryButton);
            taskButtons.appendChild(secondaryButton);
            taskButtons.appendChild(dropdown);
            taskCard.appendChild(cardHeader);
            taskCard.appendChild(cardContent);
            taskCard.appendChild(cardFooter);
            taskCard.appendChild(deadlineBackground);

            // Anexa o taskCard ao DOM na view
            if (state === 'pending') {
              document.getElementById('pending').appendChild(taskCard);
            } else if (state === 'in progress') {
              document.getElementById('in-progress').appendChild(taskCard);
            } else if (state === 'completed') {
              document.getElementById('completed').appendChild(taskCard);
            }
          }
        });
      }
    });
  }
});

  renderTask(tasks, project, state)
