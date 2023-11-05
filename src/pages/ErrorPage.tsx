import "./error.css"

function ErrorPage() {
  return (
    <div className='error-m'>
      <img src="https://static-00.iconduck.com/assets.00/emoji-sad-icon-512x512-vomssqlr.png" alt="sad emoji" />
      <h1 className='oops'>Упс!</h1>
      <p className="error-mes">404 станица не найдена</p>
    </div>
  );
};

export default ErrorPage;