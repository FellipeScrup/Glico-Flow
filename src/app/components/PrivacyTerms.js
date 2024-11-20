import { useState, useEffect, useRef } from 'react';
import styles from './PrivacyTerms.module.css';

export default function PrivacyTerms({ isOpen, onClose, onAccept }) {
    const [language, setLanguage] = useState('en'); // 'en' for English, 'pt' for Portuguese
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const toggleLanguage = () => {
        setLanguage((prevLang) => (prevLang === 'en' ? 'pt' : 'en'));
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} ref={modalRef}>
                <div className={styles.header}>
                    <h2>{language === 'en' ? 'Privacy Policy' : 'Política de Privacidade'}</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                
                <div className={styles.content}>
                    <div className={styles.languageSwitch}>
                        <button onClick={toggleLanguage}>
                            {language === 'en' ? 'Switch to Portuguese' : 'Mudar para Inglês'}
                        </button>
                    </div>
                    <div className={styles.scrollContent}>
                        {language === 'en' ? (
                            <>
                                {/* English Terms */}
                                <h3>Introduction</h3>
                                <p>Welcome to GlicoFlow. We value your privacy and are committed to protecting your personal information. This Privacy Policy describes how we collect, use, and protect your data when you use our application.</p>

                                <h3>1. Information We Collect</h3>
                                <p>We collect various types of information to provide and improve our services:</p>
                                <ul>
                                    <li><strong>Personal Data:</strong> Name, age, gender, contact information, and other information provided by you during registration.</li>
                                    <li><strong>Health Data:</strong> Blood glucose measurements, glycemic goals, medical history, and information related to your health condition.</li>
                                    <li><strong>Usage Data:</strong> Information about how you use the application, including interactions, preferences, and settings.</li>
                                    <li><strong>Technical Data:</strong> IP address, device type, operating system, and other technical information.</li>
                                </ul>

                                <h3>2. How We Use Your Information</h3>
                                <p>We use your information to:</p>
                                <ul>
                                    <li>Provide and maintain our services.</li>
                                    <li>Personalize your experience in the application.</li>
                                    <li>Send notifications, alerts, and reminders related to your health.</li>
                                    <li>Conduct analysis and research to improve our services.</li>
                                    <li>Comply with legal and regulatory obligations.</li>
                                </ul>

                                <h3>3. Information Sharing</h3>
                                <p>We may share your information with third parties only under the following circumstances:</p>
                                <ul>
                                    <li><strong>With Your Consent:</strong> When you authorize the sharing.</li>
                                    <li><strong>Service Providers:</strong> Companies that assist in operating the application, under confidentiality agreements.</li>
                                    <li><strong>Legal Requirements:</strong> To comply with laws, regulations, or court orders.</li>
                                    <li><strong>Protection of Rights:</strong> To protect the rights, property, or safety of GlicoFlow, our users, or the public.</li>
                                </ul>

                                <h3>4. Data Security</h3>
                                <p>We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>

                                <h3>5. Data Retention</h3>
                                <p>We retain your personal information for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required or permitted by law.</p>

                                <h3>6. Your Rights</h3>
                                <p>In accordance with applicable law, you have the right to:</p>
                                <ul>
                                    <li>Access your personal information.</li>
                                    <li>Request corrections to your information.</li>
                                    <li>Delete your personal data.</li>
                                    <li>Withdraw consent for data processing.</li>
                                </ul>
                                <p>To exercise these rights, please contact us through the email provided below.</p>

                                <h3>7. International Data Transfer</h3>
                                <p>Your information may be transferred to and maintained on servers located outside your state, province, country, or other governmental jurisdiction, where data protection laws may differ from those in your jurisdiction.</p>

                                <h3>8. Children's Privacy</h3>
                                <p>Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child without parental consent verification, we will take steps to remove that information from our servers.</p>

                                <h3>9. Changes to This Policy</h3>
                                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy in this application. You are advised to review this policy periodically for any changes.</p>

                                <h3>10. Contact Us</h3>
                                <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
                                <p>Email: <a href="mailto:support@glicoflow.com">support@glicoflow.com</a></p>
                                <p>Address: Example Street, 123, São Paulo, SP, Brazil</p>

                                <p>Effective Date: October 20, 2023</p>
                            </>
                        ) : (
                            <>
                                {/* Portuguese Terms */}
                                <h3>Introdução</h3>
                                <p>Bem-vindo ao GlicoFlow. Nós valorizamos a sua privacidade e estamos comprometidos em proteger suas informações pessoais. Esta Política de Privacidade descreve como coletamos, usamos e protegemos seus dados ao utilizar nosso aplicativo.</p>

                                <h3>1. Informações que Coletamos</h3>
                                <p>Coletamos diversos tipos de informações para fornecer e melhorar nossos serviços:</p>
                                <ul>
                                    <li><strong>Dados Pessoais:</strong> Nome, idade, gênero, informações de contato e outras informações fornecidas por você durante o cadastro.</li>
                                    <li><strong>Dados de Saúde:</strong> Medições de glicemia, metas de glicemia, histórico médico e informações relacionadas à sua condição de saúde.</li>
                                    <li><strong>Dados de Uso:</strong> Informações sobre como você utiliza o aplicativo, incluindo interações, preferências e configurações.</li>
                                    <li><strong>Dados Técnicos:</strong> Endereço IP, tipo de dispositivo, sistema operacional e outras informações técnicas.</li>
                                </ul>

                                <h3>2. Como Usamos Suas Informações</h3>
                                <p>Utilizamos suas informações para:</p>
                                <ul>
                                    <li>Fornecer e manter nossos serviços.</li>
                                    <li>Personalizar sua experiência no aplicativo.</li>
                                    <li>Enviar notificações, alertas e lembretes relacionados à sua saúde.</li>
                                    <li>Realizar análises e pesquisas para melhorar nossos serviços.</li>
                                    <li>Cumprir obrigações legais e regulatórias.</li>
                                </ul>

                                <h3>3. Compartilhamento de Informações</h3>
                                <p>Podemos compartilhar suas informações com terceiros somente nas seguintes circunstâncias:</p>
                                <ul>
                                    <li><strong>Com seu Consentimento:</strong> Quando você autoriza o compartilhamento.</li>
                                    <li><strong>Provedores de Serviço:</strong> Empresas que auxiliam na operação do aplicativo, sob acordos de confidencialidade.</li>
                                    <li><strong>Requisitos Legais:</strong> Para cumprir leis, regulamentos ou ordens judiciais.</li>
                                    <li><strong>Proteção de Direitos:</strong> Para proteger os direitos, propriedade ou segurança do GlicoFlow, de nossos usuários ou do público.</li>
                                </ul>

                                <h3>4. Segurança de Dados</h3>
                                <p>Implementamos medidas de segurança apropriadas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão ou armazenamento é 100% seguro, e não podemos garantir segurança absoluta.</p>

                                <h3>5. Retenção de Dados</h3>
                                <p>Retemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.</p>

                                <h3>6. Seus Direitos</h3>
                                <p>De acordo com a legislação aplicável, você tem o direito a:</p>
                                <ul>
                                    <li>Acessar suas informações pessoais.</li>
                                    <li>Solicitar correções em suas informações.</li>
                                    <li>Excluir seus dados pessoais.</li>
                                    <li>Retirar consentimento para o processamento de dados.</li>
                                </ul>
                                <p>Para exercer esses direitos, entre em contato conosco através do e-mail fornecido abaixo.</p>

                                <h3>7. Transferência Internacional de Dados</h3>
                                <p>Suas informações podem ser transferidas e mantidas em servidores localizados fora do seu estado, província, país ou outra jurisdição governamental, onde as leis de proteção de dados podem diferir das de sua jurisdição.</p>

                                <h3>8. Privacidade de Crianças</h3>
                                <p>Nossos serviços não são destinados a menores de 13 anos. Não coletamos intencionalmente informações pessoais de crianças menores de 13 anos. Se tomarmos conhecimento de que coletamos informações pessoais de uma criança sem verificação do consentimento dos pais, tomaremos medidas para remover essas informações de nossos servidores.</p>

                                <h3>9. Alterações nesta Política</h3>
                                <p>Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer mudanças publicando a nova política neste aplicativo. Recomenda-se revisar esta política regularmente para quaisquer alterações.</p>

                                <h3>10. Contato</h3>
                                <p>Se tiver dúvidas ou preocupações sobre esta Política de Privacidade, entre em contato conosco:</p>
                                <p>E-mail: <a href="mailto:suporte@glicoflow.com">suporte@glicoflow.com</a></p>
                                <p>Endereço: Rua Exemplo, 123, São Paulo, SP, Brasil</p>

                                <p>Data de Vigência: 20 de Outubro de 2023</p>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.closeButton} onClick={onClose}>
                        {language === 'en' ? 'Close' : 'Fechar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
