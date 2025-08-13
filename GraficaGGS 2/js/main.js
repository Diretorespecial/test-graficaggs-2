isdebug = false;

isminimized = false;
ispf = true;
ispj = false;

function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function changeavisosheight() {
  if (ispj) {
    if (isMobile()) $("#avisos").css("height", "800px");
    else $("#avisos").css("height", "420px");
  } else {
    if (isMobile()) $("#avisos").css("height", "720px");
    else $("#avisos").css("height", "380px");
  }
}

$(document).ready(function () {
  $(".results").hide();
  $("#previa").hide();
  $("#requisicao").hide();
  $("#downloadBtn2").hide();
  $("#downloadBtn3").hide();

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
    }
    $("#valor").val("R$ " + valor + ",00");
  });

  $("#pitxbtn").click(function () {
    navigator.clipboard.writeText(13641389000104).then(function () {
      alert("Pix copiado para a área de transferência!");
    });
  });

  $("#minimizar").click(function () {
    if (isminimized) {
      $("#avisos").removeClass("minimized");
      $("#minimizar").removeClass("rotated").addClass("rotated2");
    } else {
      $("#avisos").addClass("minimized");
      $("#minimizar").removeClass("rotated2").addClass("rotated");
    }
    isminimized = !isminimized;
  });

  $("#pjFields").hide();

  $("#fisica").click(function () {
    $("#avisoP").html(
      `● Procuração e Requisição (ambos gerados aqui) assinados no <a href="https://gov.br" target="_blank">gov.br</a>  <br>
       ● CRM frente e verso.<br>
       ● Declaração ou comprovante de endereço de atendimento em nome do médico (a Secretaria de Saúde aceita apenas contas de água, luz ou telefone) com até 90 dias de emissão.`
    );
    $("#pjFields").fadeOut(300, function () { $("#pfFields").fadeIn(300); });
    ispj = false; ispf = true; changeavisosheight();
    $("#juridica").addClass("inactive"); $("#fisica").removeClass("inactive");
  });

  $("#juridica").click(function () {
    $("#avisoP").html(
      `● Procuração e Requisição (ambos gerados aqui) assinados no <a href="https://gov.br" target="_blank">gov.br</a>  <br>
       ● CRM frente e verso.<br>
       <b> ● Cartão CNPJ.<br> ● Certificado de regularidade.</b>`
    );
    $("#pfFields").fadeOut(300, function () { $("#pjFields").fadeIn(300); });
    ispj = true; ispf = false; changeavisosheight();
    $("#fisica").addClass("inactive"); $("#juridica").removeClass("inactive");
  });

  $("#generateDoc").click(function () {
    if (!checkimputs()) return;

    $(".results").fadeIn(300);
    $("#previa").fadeIn(300);
    $("#requisicao").hide();
    $("#downloadBtn2").hide();
    $("#downloadBtn3").hide();

    let docType = $("input[name='receituario']:checked").val();
    let docPath = `assets/${docType}.png`;

    let nome, crm, especialidade, endereco, telefone, bairro, cidade, cep, rg, numero, complemento, nomesocial, cpf, rua, data;

    if (ispj) {
      nome = $("#razaoSocial").val(); crm = $("#crmPJ").val(); especialidade = $("#especialidadePJ").val();
      rua = $("#rua").val(); endereco = $("#enderecoPJ").val(); telefone = $("#telefonePJ").val();
      bairro = $("#bairro_pj").val(); cidade = $("#cidade_pj").val(); cep = $("#cep_pj").val();
      numero = $("#numero_pj").val(); complemento = $("#complemento_pj").val();
      cpf = $("#cnpj").val(); rg = ""; nomesocial = $("#razaoSocial").val(); data = $("#data_pj").val();
    } else {
      rua = $("#rua").val(); nome = $("#nameform").val(); crm = $("#crm").val(); especialidade = $("#especialidade").val();
      endereco = $("#endereco").val(); telefone = $("#telefone").val(); bairro = $("#bairro").val(); complemento = $("#complemento").val();
      cidade = $("#cidade").val(); cep = $("#cep").val(); rg = $("#rg").val(); numero = $("#numero").val(); cpf = $("#cpf").val();
      nomesocial = $("#nome_social").val(); data = $("#data").val();
    }

    // Prévia do receituário
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let img = new Image();
    img.src = docPath;
    img.onload = function () {
      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      ctx.font = "50px Arial"; ctx.fillStyle = "black";

      endereco = endereco + " " + numero + " - " + bairro;
      telefone = telefone + " - " + cidade + " - MG";

      if (docType == "tipo_amarelo") {
        ctx.fillText(nome, 1400, 160);
        ctx.font = "bold 30px Arial";
        ctx.fillText(especialidade, 1400, 200);
        ctx.fillText(crm, 1400, 230);
        ctx.font = "bold 25px Arial";
        ctx.fillText(endereco, 1400, 255);
        ctx.fillText(telefone, 1400, 275);
      } else {
        ctx.fillText(nome, 200, 200); // Ajuste correto
        ctx.font = "bold 35px Arial";
        ctx.fillText(especialidade, 200, 250); 
        ctx.fillText(crm, 200, 300);
        ctx.font = "bold 30px Arial";
        ctx.fillText(endereco, 200, 350);
        ctx.fillText(telefone, 200, 400);
      }

      $("#preview").attr("src", canvas.toDataURL("image/png"));
    };

    // Procuração
    let canvas2 = document.createElement("canvas");
    let ctx2 = canvas2.getContext("2d");
    let img2 = new Image();
    img2.src = "assets/procuracao.png";
    img2.onload = function () {
      canvas2.width = img2.width; canvas2.height = img2.height;
      ctx2.drawImage(img2, 0, 0);

      ctx2.font = "bold 40px Arial"; ctx2.fillStyle = "black";
      // Coordenadas corrigidas para PROCURAÇÃO
      ctx2.fillText(nome, 500, 400);
      ctx2.fillText(rg, 500, 450);
      ctx2.fillText(cpf, 500, 500);
      ctx2.fillText(endereco, 500, 550);
      ctx2.fillText(bairro, 500, 600);
      ctx2.fillText(cidade + " - MG", 500, 650);
      ctx2.fillText(telefone, 500, 700);

      let { jsPDF } = window.jspdf;
      let doc2 = new jsPDF({ orientation: "portrait", unit: "mm", format: [210, 297] });
      doc2.addImage(canvas2.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
      $("#preview2").attr("src", canvas2.toDataURL("image/png"));
      $("#downloadBtn2").attr("href", doc2.output("bloburl")).attr("download", "procuracao.pdf").show();
    };

    // Requisição
    let canvas3 = document.createElement("canvas");
    let ctx3 = canvas3.getContext("2d");
    let img3 = new Image();
    img3.src = "assets/requisicao.png";
    img3.onload = function () {
      canvas3.width = img3.width; canvas3.height = img3.height;
      ctx3.drawImage(img3, 0, 0);

      ctx3.font = "bold 30px Arial"; ctx3.fillStyle = "black";

      // Coordenadas corrigidas para REQUISIÇÃO
      ctx3.fillText(nome, 200, 360);
      ctx3.fillText(nomesocial, 200, 420);
      ctx3.fillText(crm, 200, 480);
      ctx3.fillText(especialidade, 500, 480);
      ctx3.fillText(telefone, 1100, 480);
      ctx3.fillText(rua, 200, 560);
      ctx3.fillText(numero, 1100, 560);
      ctx3.fillText(complemento, 1300, 560);
      ctx3.fillText(cidade, 200, 630);
      ctx3.fillText(bairro, 760, 630);
      ctx3.fillText(cep, 1300, 630);

      let { jsPDF } = window.jspdf;
      let doc3 = new jsPDF({ orientation: "portrait", unit: "mm", format: [210, 297] });
      doc3.addImage(canvas3.toDataURL("image/png"), "PNG", 0, 0, 210, 297);
      $("#preview3").attr("src", canvas3.toDataURL("image/png"));
      $("#downloadBtn3").attr("href", doc3.output("bloburl")).attr("download", "requisicao.pdf").show();
    };
  });
});

function checkimputs() {
  if (isdebug) return true;

  let allFieldsFilled = true;
  let activeForm = ispj ? "#pjFields" : "#pfFields";

  $(activeForm).find("input[required], select[required]").each(function () {
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
  }
  return allFieldsFilled;
}
