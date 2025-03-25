export class FormPost {
    constructor(idForm, idTextarea, idUlPost) {
        this.form = document.getElementById(idForm);
        this.textarea = document.getElementById(idTextarea);
        this.ulPost = document.getElementById(idUlPost);
        this.addSubmit();
    }

    onSubmit(func) {
        this.form.addEventListener('submit', func)
    }

            
    formValidate(value){
       if(value == '' || value == null || value == undefined || value.length < 3){
        return false

       }
       return true
    }

    getTime(){
        const time = new Date();
        const hour = time.getHours()
        const minutes = time.getMinutes()
        return `${hour}h ${minutes}min`
    }


    addSubmit() {
        const handleSubmit = (event) => {
            event.preventDefault();
            if (this.formValidate(this.textarea.value)){
                const time = this.getTime();
                const newPost = document.createElement('li');
            newPost.classList.add('post');
            newPost.innerHTML = `
        <div class="infoUserPost">
        <div class="imgUserPost"></div>
        
        <div class="nameAndHour">
            <strong>Juan Yago</strong>
            <p>${time}</p>
        </div>
    </div>

    <p>${this.textarea.value}</p>

    <div class="actionBtnPost">
        <button type="button" class="filesPost like" alt="Curtir">
            <img src="./src/styles/assets/heart.svg" alt=""> Curtir
            </button>
        <button type="button" class="filesPost comment" alt="Comentar">
            <img src="./src/styles/assets/comment.svg" alt=""> Comentar
            </button>
        <button type="button" class="filesPost share" alt="Compartilhar">
            <img src="./src/styles/assets/share.svg" alt=""> Compartilhar</button>
    </div>
        `;
        this.ulPost.append(newPost);
        this.textarea.value = "";
        }else {
            alert('Verifique o campo digitado')
        }

        }

            
        this.onSubmit(handleSubmit)
    }

}

let postForm = new FormPost('formPost', 'textarea', 'posts')