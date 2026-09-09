function cambiarTab(tab:string) {
            const loginField = document.getElementById('log_field')!;
            const registerField = document.getElementById('register_field')!;
            const tabLogin = document.getElementById('tab-login')!;
            const tabRegister = document.getElementById('tab-register')!;

            if (tab === 'login') {
                loginField.classList.remove('oculto');
                registerField.classList.add('oculto');
                tabLogin.classList.add('activo');
                tabRegister.classList.remove('activo');
            } else {
                registerField.classList.remove('oculto');
                loginField.classList.add('oculto');
                tabRegister.classList.add('activo');
                tabLogin.classList.remove('activo');
            }
        }

function togglePassword(inputId:string, btn:HTMLElement) {
            const input = document.getElementById(inputId)! as HTMLInputElement;
            if (input.type === 'password') {
                input.type = 'text';
                btn.style.color = '#e6c594';
            } else {
                input.type = 'password';
                btn.style.color = 'rgba(255, 255, 255, 0.4)';
            }
        }

const loginForm = document.getElementById('log_form') as HTMLFormElement;
const registerForm = document.getElementById('register_form') as HTMLFormElement

registerForm.addEventListener('submit', async (ev:Event) => {
    ev.preventDefault()
    const userError = document.getElementById('user-error')!;
    userError.classList.add('oculto')
    userError.textContent = '' 

    const regForm = new FormData(registerForm)
    const verificarForm = Object.fromEntries(regForm.entries()) as { new_username: string, new_password: string, confirm_password: string }

    if (verificarForm.new_password !== verificarForm.confirm_password) {
        const passError = document.querySelectorAll('.password-error');
            passError.forEach((msg) => {
                    msg.classList.remove('oculto')
                    msg.textContent = 'Las contraseñas no coinciden'  
            })
        return
    }
    const valForm = {
        new_username: verificarForm.new_username,
        new_password: verificarForm.new_password
    }
    
    try {
        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(valForm)
        })
        if (respuesta.ok) {
            window.location.href = `${import.meta.env.VITE_HTTP_URL}/indexInv`
            registerForm.reset()
        } else {
            if (respuesta.headers.get('Content-Type')?.includes('application/json')) {
                const {error} = await respuesta.json()
                const userError = document.getElementById('user-error')!;
                    userError.classList.remove('oculto')
                    userError.textContent = error      
            } else {
                alert('Error al registrar, intente de nuevo')
            }
        }
    } catch (error) {
        console.log('Error de conexion', error);
    }
})

loginForm.addEventListener('submit', async (ev:Event) => {
    ev.preventDefault()
    const textError = document.querySelectorAll('.error-message');
    textError.forEach((msg) => {
        msg.classList.add('oculto')
        msg.textContent = ''
    })    

    const logForm = new FormData(loginForm)
    const valForm = Object.fromEntries(logForm.entries())

    try {
        const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(valForm)
        })

        if (respuesta.ok) {
            window.location.href = `${import.meta.env.VITE_HTTP_URL}/indexInv`
            loginForm.reset();
        } else {
            if (respuesta.headers.get('Content-Type')?.includes('application/json')) {
                const {error} = await respuesta.json()
                textError.forEach((msg) => {
                    if (error) {
                        msg.classList.remove('oculto')
                        msg.textContent = error    
                    }
                }) 
            } else {
                alert('Error al validar, intente de nuevo')
            }
        }
    } catch (error) {
        console.log('Error de conexion', error)
    }
})