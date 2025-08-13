// Autor: José Minelli
isdebug = false;

isminimized = false;
ispf = true;
ispj = false;

// Função pra verificar se é mobile
function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function changeavisosheight() {
    if(ispj) {
      if (isMobile()) {
        let height = 800;
        $("#avisos").css("height", height + "px");
      } else {
        let height = 420;
        $("#avisos").css("height", height + "px");
      }
    } else {
      if (isMobile()) {
        let height = 720;
        $("#avisos").css("height", height + "px");
      } else {
        let height = 380;
        $("#avisos").css("height", height + "px");
      }
    }
}

$(document).ready(function () {

  $(".radio").change(function () {
    if ($(this).val() == "tipo_amarelo") {
      $("#qtd").val("1");
      $("#valor").val("R$ 90,00");
      $("#qtd").attr("disabled", true);
    } else {
      $("#qtd").attr("disabled", false);
    }
  });

  $("#qtd").change(function () {
    let valor = 0;
    switch ($(this).val()) {
      case "1": valor = 100; break;
      case "2": valor = 120; break;
      case "3": valor = 130; break;
      case "4": valor = 140; break;
      case "5": valor = 150; break;
      case "6": valor = 170; break;
      case "10": valor = 210; break;
      case "20": valor = 260; break;
    }
    $("#valor").val("R$ " + valor + ",00");
  });

  $("#pitxbtn").click(function () {
    navigator.clipboard.writeText(13641389000104).then(function () {
      alert("Pitx copiado para a área de transferência!");
    });
  });

  $("#minimizar").click(function () {
    if (isminimized) {
      $("#avisos").removeClass("minimized");
      $("#minimizar").removeClass("rotated");
      $("#minimizar").addClass("rotated2");
    } else {
      $("#avisos").addClass("minimized");
      $("#minimizar").removeClass("rotated2");
      $("#minimizar").addClass("rotated");
    }
    isminimized = !isminimized;
  });

  $("#pjFields").hide();

  $("#fisica").click(function () {
    $("#avisoP").html(
      `
      ● Procuração e Requisição (ambos gerados aqui) assinados no <a href="https://gov.br" target="_blank">gov.br</a>  <br>
      ● CRM frente e verso.<br>
      ● Declaração ou comprovante de endereço de atendimento em nome do médico (a Secretaria de Saúde aceita apenas contas de água, luz ou telefone) com até 90 dias de emissão.
      `
    );
    $("#pjFields").fadeOut(300, function () {
      $("#pfFields").fadeIn(300);
    });
    ispj = false;
    ispf = true;
    changeavisosheight();
    $("#juridica").addClass("inactive");
    $("#fisica").removeClass("inactive");
  });

  $("#juridica").click(function () {
    $("#avisoP").html(
      `
      ● Procuração e Requisição (ambos gerados aqui) assinados no <a href="https://gov.br" target="_blank">gov.br</a>  <br>
      ● CRM frente e verso.<br>
      <b> ● Cartão CNPJ. -- adicional para pessoa jurídica<br> 
      ● Certificado de regularidade.  -- adicional para pessoa jurídica<br> </b>
      `
    );
    $("#pfFields").fadeOut(300, function () {
      $("#pjFields").fadeIn(300);
    });
    ispj = true;
    ispf = false;
    changeavisosheight();
    $("#fisica").addClass("inactive");
    $("#juridica").removeClass("inactive");
  });

  $("#generateDoc").click(function () {
    if (!checkimputs()) {
      return;
    }

    setTimeout(function () {
      $("html, body").animate(
        { scrollTop: $("#preview").offset().top },
        800
      );
    }, 500);

    $(".results").fadeIn(300);
    $(".results").removeClass("hidden");
    $(".result").removeClass("hidden");

    // Dados do formulário
    let nome, crm, especialidade, endereco, telefone, bairro, cidade, cep, rg, numero, data, complemento, nomesocial, cpf, rua;
    if ($("#fisica").hasClass("inactive")) {
      nome = $("#razaoSocial").val();
      crm = $("#crmPJ").val();
      especialidade = $("#especialidadePJ").val();
      rua = $("#rua").val();
      endereco = $("#enderecoPJ").val();
      telefone = $("#telefonePJ").val();
      bairro = $("#bairro_pj").val();
      cidade = $("#cidade_pj").val();
      cep = $("#cep_pj").val();
      numero = $("#numero_pj").val();
      complemento = $("#complemento_pj").val();
      cpf = $("#cnpj").val();
      rg = "";
      nomesocial = $("#razaoSocial").val();
      data = $("#data_pj").val();
    } else {
      rua = $("#rua").val();
      nome = $("#nameform").val();
      crm = $("#crm").val();
      especialidade = $("#especialidade").val();
      endereco = $("#endereco").val();
      telefone = $("#telefone").val();
      bairro = $("#bairro").val();
      complemento = $("#complemento").val();
      cidade = $("#cidade").val();
      cep = $("#cep").val();
      rg = $("#rg").val();
      numero = $("#numero").val();
      cpf = $("#cpf").val();
      nomesocial = $("#nome_social").val();
      data = $("#data").val();
    }

    // Debug
    if (isdebug) {
      nome = "José Minelli";
      nomesocial = "José Minelli";
      crm = "123456";
      especialidade = "Cardiologia";
      endereco = "Rua Exemplo, 123";
      telefone = "(11) 98765-4321";
      bairro = "Centro";
      complemento = "Apto 101";
      cidade = "São Paulo";
      cep = "12345-678";
      rg = "12.345.678-9";
      numero = "123";
      cpf = "123.456.789-00";
      data = "2023-10-01";
    }

    let docType = $("input[name='receituario']:checked").val();
    let docPath = `assets/${docType}.png`;
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let img = new Image();
    img.src = docPath;

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      ctx.textAlign = "center";
      ctx.font = "50px 'TimesNewRoman', Times New Roman";
      ctx.fillStyle = "black";
      endereco = endereco + " " + numero + " - " + bairro;
      telefone = telefone + " - " + cidade + " - " + "MG";

      if (docType == "tipo_amarelo") {
        ctx.fillText(nome, 1400, 160);
        ctx.font = "bold 30px Arial";
        ctx.fillText(especialidade, 1400, 200);
        ctx.fillText(crm, 1400, 230);
        ctx.font = "bold 25px Arial";
        ctx.fillText(endereco, 1400, 255);
        ctx.fillText(telefone, 1400, 275);
      } else {
        ctx.font = "60px 'TimesNewRoman', Times New Roman";
        ctx.fillText(nome, 1750, 160);
        ctx.font = "bold 35px Arial";
        ctx.fillText(especialidade, 1750, 200);
        ctx.fillText(crm, 1750, 240);
        ctx.font = "bold 30px Arial";
        ctx.fillText(endereco, 1750, 320);
        ctx.fillText(telefone, 1750, 350);
      }

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [960, 355],
      });

      let imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 0, 0, 960, 355);

      let preview = document.getElementById("preview");
      preview.src = imgData;

      $("#previa").fadeIn(300);
      $("#downloadBtn2")
        .attr("href", doc.output("bloburl"))
        .attr("download", "procuracao.pdf")
        .show();
    };

    // Requisição
    let docPath3 = `assets/requisicao.png`;
    let canvas3 = document.createElement("canvas");
    let ctx3 = canvas3.getContext("2d");
    let img3 = new Image();
    img3.src = docPath3;

    img3.onload = function () {
      canvas3.width = img3.width;
      canvas3.height = img3.height;
      ctx3.drawImage(img3, 0, 0);

      ctx3.font = "bold 30px Arial";
      ctx3.fillStyle = "black";

      if (ispf) {
        ctx3.fillText(nome, 200, 360);
        ctx3.fillText(nomesocial, 200, 420);
        ctx3.fillText(crm, 200, 490);
        ctx3.fillText(especialidade, 500, 490);
        ctx3.fillText(telefone, 1100, 490);
        ctx3.fillText(rua, 200, 560);
        ctx3.fillText(numero, 1100, 560);
        ctx3.fillText(complemento, 1300, 560);
        ctx3.fillText(cidade, 200, 630);
        ctx3.fillText(bairro, 760, 630);
        ctx3.fillText(cep, 1300, 630);
      } else {
        ctx3.fillText(nome, 200, 750);
        ctx3.fillText(cpf, 1100, 750);
        ctx3.fillText(crm, 200, 955);
        ctx3.fillText(especialidade, 500, 955);
        ctx3.fillText(telefone, 1100, 955);
        ctx3.fillText(rua, 200, 815);
        ctx3.fillText(numero, 1100, 815);
        ctx3.fillText(complemento, 1300, 815);
        ctx3.fillText(cidade, 200, 890);
        ctx3.fillText(bairro, 760, 890);
        ctx3.fillText(cep, 1300, 890);
      }

      const { jsPDF } = window.jspdf;
      const doc2 = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [210, 297],
      });

      let imgData3 = canvas3.toDataURL("image/png");
      doc2.addImage(imgData3, "PNG", 0, 0, 210, 297);

      $("#requisicao").fadeIn(300);
      $("#downloadBtn3")
        .attr("href", doc2.output("bloburl"))
        .attr("download", "requisicao.pdf")
        .show();

      let preview3 = document.getElementById("preview3");
      preview3.src = imgData3;
    };
  });
});

function checkimputs() {
  if (isdebug) {
    return true;
  }

  let allFieldsFilled = true;
  let activeForm = ispj ? "#pjFields" : "#pfFields";

  $(activeForm)
    .find("input[required], select[required]")
    .each(function () {
      if ($(this).val().trim() === "") {
        allFieldsFilled = false;
        $(this).addClass("error");
      } else {
        $(this).removeClass("error");
      }
    });

  if (!$("input[name='receituario']:checked").val()) {
    allFieldsFilled = false;
    alert("Por favor, selecione um tipo de receituário.");
    return false;
  }

  if (!allFieldsFilled) {
    return false;
  }

  return true;
}
