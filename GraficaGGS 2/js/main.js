// Autor: José Minelli
isdebug = false;

isminimized = false;
ispf = true;
ispj = false;

// Detecta mobile
function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function changeavisosheight() {
  if (ispj) {
    $("#avisos").css("height", (isMobile() ? 800 : 420) + "px");
  } else {
    $("#avisos").css("height", (isMobile() ? 720 : 380) + "px");
  }
}

$(document).ready(function () {
  // --- Remover completamente bloco de Declaração (se existir no HTML) ---
  $("#declaracao").remove();

  // Esconder resultados e botões inicialmente
  $(".results").addClass("hidden").hide();
  $(".result").addClass("hidden").hide();
  $("#downloadBtn2, #downloadBtn3").hide();

  // ---- Regras de UI ----
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
    $("#avisoP").html(`
      ● Procuração e Requisição (ambos gerados aqui) assinados no <a href="https://gov.br" target="_blank">gov.br</a>  <br>
      ● CRM frente e verso.<br>
      ● Declaração ou comprovante de endereço de atendimento em nome do médico (a Secretaria de Saúde aceita apenas contas de água, luz ou telefone) com até 90 dias de emissão.
    `);
    $("#pjFields").fadeOut(300, function () { $("#pfFields").fadeIn(300); });
    ispj = false; ispf = true; changeavisosheight();
    $("#juridica").addClass("inactive"); $("#fisica").removeClass("inactive");
  });

  $("#juridica").click(function () {
    $("#avisoP").html(`
      ● Procuração e Requisição (ambos gerados aqui) assinados no <a href="https://gov.br" target="_blank">gov.br</a>  <br>
      ● CRM frente e verso.<br>
      <b> ● Cartão CNPJ. -- adicional para pessoa jurídica<br> 
      ● Certificado de regularidade.  -- adicional para pessoa jurídica<br> </b>
    `);
    $("#pfFields").fadeOut(300, function () { $("#pjFields").fadeIn(300); });
    ispj = true; ispf = false; changeavisosheight();
    $("#fisica").addClass("inactive"); $("#juridica").removeClass("inactive");
  });

  // --------- GERAR DOCUMENTOS ----------
  $("#generateDoc").click(function () {
    if (!checkimputs()) return;

    // Mostrar container e todas as áreas de resultado
    $(".results").removeClass("hi
