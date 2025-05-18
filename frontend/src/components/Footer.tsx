import '../styles/Footer.css'; // Importando o CSS

export default function Footer() {
    return(
       <div>
        <footer className='footer'>
        Data retrieved from CPTEC/INPE. Visit: 
        <a href="https://www.cptec.inpe.br/" target="_blank" rel="noopener noreferrer">
        https://www.cptec.inpe.br/
        </a>
        </footer>
       </div> 
    );
}