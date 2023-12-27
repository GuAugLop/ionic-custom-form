const notifications = document.querySelector('.notifications'),
  buttons = document.querySelectorAll('.buttons .btn');
// Object containing details for different types of toasts
const toastDetails = {
  timer: 5000,
  success: {
    icon: 'checkmark-circle-sharp',
  },
  error: {
    icon: 'alert-circle',
  },
  warning: {
    icon: 'warning',
  },
  info: {
    icon: 'information-circle',
  },
};
const removeToast = (toast: any) => {
  toast.classList.add('hide');
  if (toast.timeoutId) clearTimeout(toast.timeoutId); // Clearing the timeout for the toast
  setTimeout(() => toast.remove(), 500); // Removing the toast after 500ms
};
export const createToast = ({
  type,
  title,
  subtitle,
}: {
  type: 'info' | 'success' | 'error' | 'warning';
  title?: string;
  subtitle?: string;
}) => {
  // Getting the icon and text for the toast based on the id passed
  //@ts-ignore
  const { icon } = toastDetails[type];
  const toast = document.createElement('li'); // Creating a new 'li' element for the toast
  const closeBtn = document.createElement('ion-icon');
  closeBtn.name = 'close';
  closeBtn.addEventListener('click', () => {
    removeToast(toast);
  });
  closeBtn.style.cursor = 'pointer';
  toast.className = `toast ${type}`; // Setting the classes for the toast

  // Setting the inner HTML for the toast
  toast.innerHTML = `<div class="column">
                        <div class="left">
                         <ion-icon name="${icon}"></ion-icon>
                         <div class="messages">
                            <span class="title">${title || ''}</span>
                            <span class="subtitle">${subtitle || ''}</span>
                         </div>
                        </div>
                      </div>
                      `;
  toast.firstChild?.appendChild(closeBtn);
  notifications?.appendChild(toast); // Append the toast to the notification ul
  // Setting a timeout to remove the toast after the specified duration
  //@ts-ignore
  toast.timeoutId = setTimeout(() => removeToast(toast), toastDetails.timer);
};
