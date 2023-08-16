function useSwal() {
  const swal = inject('$swal');
  return Object.assign(swal, {
    error(msg) {
      return swal.fire({
        title: 'Error!',
        text: msg,
        icon: 'error',
        confirmButtonText: 'Close',
      });
    },
  });
}

export default useSwal;
