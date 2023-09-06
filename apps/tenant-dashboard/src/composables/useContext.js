export default function useContext() {
  const { ctx } = getCurrentInstance();
  return ctx;
}
