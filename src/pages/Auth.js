const Auth = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  return (
    <>
      <h1>발급받은 인가 코드: {code}</h1>
    </>
  );
};
export default Auth;
