"use strict"

const controllerDistribuicaoDFe = require("../controllers/distribuicaoDFe-controller")
const { convertPFX, zeroPad } = require("../util")

class DistribuicaoDFe {
  /**
   * @param {Object} opts
   * @param {Buffer} opts.pfx
   * @param {string} opts.passphrase
   * @param {string} opts.cert
   * @param {string} opts.key
   * @param {string} opts.cUFAutor
   * @param {string} opts.cnpj
   * @param {string} opts.tpAmb
   * @param {Object} opts.options
   * @param {Object} opts.options.requestOptions
   * @param {Object} opts.options.httpsOptions
   */
  constructor(opts) {
    const { requestOptions = {}, httpsOptions = {} } = opts.options || {}

    let cert = opts.cert || ""
    let key = opts.key || ""

    if (opts.pfx) {
      if (!opts.passphrase) {
        throw new Error("Senha do Certificado não informada.")
      }

      const pfxLoad = convertPFX(opts.pfx, opts.passphrase)

      cert = pfxLoad.cert
      key = pfxLoad.key
    }

    if (!cert) {
      throw new Error("Cert não informado.")
    }

    if (!key) {
      throw new Error("Key não informada.")
    }

    if (!opts.cUFAutor) {
      throw new Error("Codigo UF NFe não informado.")
    }

    if (!opts.cnpj) {
      throw new Error("CNPJ não informado.")
    }

    if (!opts.tpAmb) {
      throw new Error("Ambiente não informado.")
    }

    this.opts = {
      cUFAutor: opts.cUFAutor,
      cnpj: opts.cnpj,
      tpAmb: opts.tpAmb,
      cert: cert,
      key: key,
      requestOpt: requestOptions,
      httpsOpt: httpsOptions,
    }
  }

  /**
   * @param {string} ultNSU
   */
  consultaPorUltNSU(ultNSU) {
    const pesquisa = {
      grupo: "distNSU",
      consulta: "ultNSU",
      valor: "000000000000000",
    }

    if (ultNSU) {
      ultNSU = String(ultNSU)
      if (ultNSU.length > 15) {
        throw new Error("NSU com tamanho incorreto.")
      }
      pesquisa["valor"] = zeroPad(ultNSU, 15)
    }

    const opts = this.opts
    opts["pesquisa"] = pesquisa

    return controllerDistribuicaoDFe.enviar(opts)
  }

  /**
   * @param {string} chNFe
   */
  consultaPorChaveNFe(chNFe) {
    if (!chNFe) {
      throw new Error("chNFe não informada.")
    }

    chNFe = String(chNFe)

    if (chNFe.length !== 44) {
      throw new Error("chNFe com tamanho incorreto.")
    }

    const pesquisa = {
      grupo: "consChNFe",
      consulta: "chNFe",
      valor: chNFe,
    }

    const opts = this.opts
    opts["pesquisa"] = pesquisa

    return controllerDistribuicaoDFe.enviar(opts)
  }

  /**
   * @param {string} nsu
   */
  consultaPorNSU(nsu) {
    if (nsu === 0) {
      nsu = "000000000000000"
    }

    if (!nsu) {
      throw new Error("NSU não informado.")
    }

    nsu = String(nsu)
    if (nsu.length > 15) {
      throw new Error("NSU com tamanho incorreto.")
    }

    const pesquisa = {
      grupo: "consNSU",
      consulta: "NSU",
      valor: zeroPad(nsu, 15),
    }

    const opts = this.opts
    opts["pesquisa"] = pesquisa

    return controllerDistribuicaoDFe.enviar(opts)
  }
}

module.exports = DistribuicaoDFe