import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import ImageUploader from "react-images-upload";

import logo_register from "../assets/images/logo_register.png";
import "../styles/pages/Register.css";

import { register } from "../redux/actions/auth.js";

const Register = (props) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("");
  const [image, setImage] = useState({});
  const [base64Image, setBase64Image] = useState("");

  const currentUser = useSelector((state) => state.main.currentUser);
  const error = useSelector((state) => state.main.error);

  const checkPassword =
    password !== "" && confPass !== "" && password === confPass;
  const disableButton =
    !checkPassword || name === "" || course === "" || email === "";

  function isEmpty(obj) {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
  }

  const redirectError = () => {
    if (error) {
      props.history.push("/error");
    }
  };

  const redirectHome = () => {
    if (!isEmpty(currentUser) && !currentUser.error) {
      props.history.push("/home");
    }
  };

  useEffect(() => {
    redirectError();
  });

  useEffect(() => {
    redirectHome();
  });

  useEffect(() => {
    const errorUpload = !!document.getElementsByClassName("errorMessage")[0];
    if (!errorUpload) {
      if (!isEmpty(image)) {
        const elem = document.getElementsByClassName("uploadPicture");
        setBase64Image(elem[0].getAttribute("src"));
      }
    }
  }, [image]);

  const renderAlert = (condition, message) => {
    return (
      <p
        style={{
          display: condition ? "flex" : "none",
          fontSize: "17px",
          color: "red",
          width: "inherit",
          margin: "10px auto 0px auto",
        }}
      >
        {message}
      </p>
    );
  };

  const onDrop = (picture) => {
    setImage(picture);
  };

  const user = {
    name,
    course,
    email,
    password,
    profilePicture: base64Image,
  };

  return (
    <div className="main_register_container">
      <div className="seja_bem_vindo">
        <img className="img_logo" alt="Logo Laserterapia" src={logo_register} />
        <b className="texto_bem_vindo">Seja bem vindo!</b>
      </div>
      <div className="form_register">
        <b className="cadastre_se">CADASTRE-SE</b>
        <input
          onChange={(e) => setName(e.target.value)}
          className="inputs"
          placeholder="Nome Completo"
        ></input>
        <input
          onChange={(e) => setCourse(e.target.value)}
          className="inputs"
          placeholder="Curso"
        ></input>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          className="inputs"
          placeholder="Email"
        ></input>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          className="inputs senha"
          placeholder="Senha"
        ></input>
        <input
          type="password"
          onChange={(e) => setConfPass(e.target.value)}
          className="inputs"
          placeholder="Repita sua senha"
        ></input>
        {renderAlert(
          password !== "" && confPass !== "" && password !== confPass,
          "As senhas devem ser iguais"
        )}
        {renderAlert(
          currentUser.error,
          `${currentUser.error} Contate o usuário administrador.`
        )}
        <ImageUploader
          buttonText="Escolha sua foto de perfil"
          label=""
          withPreview={true}
          onChange={onDrop}
          singleImage={true}
          withIcon={false}
          fileTypeError="não é um tipo de arquivo suportado."
          fileSizeError="imagem muito grande."
          imgExtension={[".jpg", ".png", ".jpeg", ".jfif"]}
          maxFileSize={2000000}
          fileContainerStyle={{ boxShadow: "none" }}
        />

        <button
          onClick={() => dispatch(register(user))}
          disabled={disableButton}
          style={{
            cursor: disableButton ? "not-allowed" : "pointer",
            opacity: disableButton ? "0.5" : "1.0",
          }}
          className="register_button"
        >
          FINALIZAR CADASTRO
        </button>
      </div>
    </div>
  );
};

export default withRouter(Register);
