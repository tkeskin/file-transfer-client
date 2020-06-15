export default {
    confirm: {
        text: 'Are you sure?',
        type: 'warning',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCloseButton: true,
        showLoaderOnConfirm: true
    },
    successToast: {
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Success',
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 2250
    },
    errorToast: {
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Error',
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 2250
    }
}