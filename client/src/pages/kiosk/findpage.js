import './findpage.css';
import Footer from './footer'

function findpage() {
    return (
    <div>
        <img
        className="logo"
        src={process.env.PUBLIC_URL + '/img/kiosk/예비로고.png'}
        alt={'title'}
        ></img>
        <Footer />
    </div>
    )
}

export default findpage;