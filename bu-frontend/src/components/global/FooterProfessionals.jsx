import {Flex} from "antd"
import {MailOutlined} from "@ant-design/icons"

import styles from "../../styles/global/footerProfessionals.module.css"

export default function FooterProfessionals({...props}){
  
  const globalTextWhite = {
    color:"#ffffff"
  }

  return (
    <>
      <footer className={styles.footer} {...props}>
        <Flex
        style={globalTextWhite}
        justify="flex-start"
        align="center"
        gap={32}>
          <p className={styles.title}>Universidad del Valle</p>
        </Flex>


        <Flex className={styles.box}>
          <Flex vertical
          style={globalTextWhite} 
          justify="center" align="center"
          className={styles.boxLeft}>
            <p className={`${styles.parag} ${styles.subtitle}`}>Más información</p>
            <p className={`${styles.parag} ${styles.pTranspa} text-left`}>
              Oficina de Bienestar Universitario primer piso Bloque A
              <br />
              Seccional Palmira
              <br /><br />
              Lunes a viernes de 8:00 a.m. a 12:30 p.m. y 2:00 a 5:30 p.m.
              <br /><br />
              Servicio de Psicología Tercer piso Bloque A
              <br />
              Seccional Palmira
              <br /><br />
              Servicio de Enfermería Primer piso Bloque A
              <br />
              Seccional Palmira
              <br /><br />
              Servicio de Odontología Segundo piso Bloque A
              <br />
              Seccional Palmira
              <br /><br />
              Trabajo Social Tercer piso Bloque A (Oficina del servicio psicología)
              <br />
              Seccional Palmira
            </p>
          </Flex>


          <Flex 
          vertical
          style={globalTextWhite}
          align="center"
          className={styles.boxRight}>
            <p className={`${styles.parag} ${styles.subtitle}`}>Contacto</p>
            <p className={`${styles.parag} text-left`}>
            <MailOutlined className={styles.email}/>  Becas de alimentación
              <br />            
                <a className={styles.ancle} href="mailto:bonoalimentacion.palmira@gmail.com">bonoalimentacion.palmira@gmail.com</a>
              <br /><br />
              <MailOutlined className={styles.email}/>  Bienestar Universitario
              <br />            
                <a className={styles.ancle} href="mailto:bienestar.palmira@correounivalle.edu.co">bienestar.palmira@correounivalle.edu.co</a>
              <br /><br />
              <MailOutlined className={styles.email}/>  Servicio de Psicología
              <br />            
                <a className={styles.ancle} href="mailto:servicio.psicologia.palmira@correounivalle.edu.co">servicio.psicologia.palmira@correounivalle.edu.co</a>
              <br /><br />                          
              <MailOutlined className={styles.email}/>  Servicio de Enfermería
              <br />            
                <a className={styles.ancle} href="mailto:servicio.enfermeria.palmira@correounivalle.edu.co">servicio.enfermeria.palmira@correounivalle.edu.co</a>
              <br /><br />            
              <MailOutlined className={styles.email}/>  Servicio de Odontología
              <br />
                <a className={styles.ancle} href="mailto:odontologia.uvp@gmail.com">odontologia.uvp@gmail.com</a>
              <br /><br />            
              <MailOutlined className={styles.email}/>  Trabajo Social
              <br />
                <a className={styles.ancle} href="mailto:trabajosocial.palmira@correounivalle.edu.co">trabajosocial.palmira@correounivalle.edu.co</a>
            </p>
          </Flex>
        </Flex>
      </footer>
    </>
  )
}