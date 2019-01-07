const utils = require("../utils");

module.exports = {
  getMovies: async () => {
    await utils.delay(500); // simulate some latency
    return [
      {
        id: 1,
        title: "VENOM",
        release: "04-10-2018",
        content: {
          short:
            "Tom Hardy is te zien als de mysterieuze Venom, een van Marvel’s stoerste en dodelijkste personages.",
          full: ``
        },
        media: {
          poster: {
            small:
              "https://media.pathe.nl/thumb/180x254/gfx_content/other/api/filmdepot/v1/movie/download/19770_101034_ps_sd-high.jpg",
            large:
              "https://media.pathe.nl/nocropthumb/1600x590/gfx_content/other/api/filmdepot/v1/movie/download/19770_102099_st_sd-high.jpg"
          }
        }
      },
      {
        id: 2,
        title: "Fantastic Beasts: The Crimes of Grindelwald",
        release: "14-11-2018",
        content: {
          short:
            "Aan het einde van de eerste film, werd de krachtige Duistere Magiër Gellert Grindelwald (Johnny Depp) met de hulp van Newt Scamander (Eddie Redmayne) gevangen genomen door MACUSA (Magisch Congres van de Verenigde Staten van Amerika).",
          full: `Aan het einde van de eerste film, werd de krachtige Duistere Magiër Gellert Grindelwald (Johnny Depp) met de hulp van Newt Scamander (Eddie Redmayne) gevangen genomen door MACUSA (Magisch Congres van de Verenigde Staten van Amerika).

Maar, hij maakt zijn dreigementen waar en Grindelwald ontsnapt uit zijn gevangenschap.Hij heeft zijn zinnen gezet op het verzamelen van zoveel mogelijk volgelingen die niets afweten van zijn ware bedoelingen: tovenaars van zuiver bloed grootbrengen om te kunnen heersen over alle niet - magische wezens. 

In een poging om Grindelwald’s plannen te dwarsbomen roept Albus Perkamentus(Jude Law) zijn voormalige student Newt Scamander op, die ermee instemt om te helpen maar zich niet bewust is van de gevaren die voor hem liggen.Lijnen worden getrokken en liefde en loyaliteit worden op de proef gesteld, zelfs tussen de meest trouwe vrienden en families.De verdeeldheid in de magische wereld wordt steeds groter.`
        },
        media: {
          poster: {
            small:
              "https://media.pathe.nl/thumb/180x254/gfx_content/other/api/filmdepot/v1/movie/download/23356_103701_ps_sd-high.jpg",
            large:
              "https://media.pathe.nl/nocropthumb/1600x590/gfx_content/2 Grote Still/FNBST2_First_Look_3000x1800-R01_master-rev-1.jpg"
          }
        }
      },
      {
        id: 3,
        title: "Kensington Live at Ziggo Dome 2017 ",
        release: "14-11-2018",
        content: {
          short:
            "Op donderdag 22 november 2018 vertoont Kensington eenmalig de live registratie van hun afgelopen Ziggo Dome show.",
          full: `Voordat Kensington deze zomer de grootste Nederlandse rockshow ooit speelde in de Johan Cruijff ArenA, stonden ze in de drie jaren daarvoor maar liefst tien keer in een uitverkochte Ziggo Dome. In 2017 waren dit vijf shows met in totaal ruim 85.000 bezoekers. 

Komende november speelt de band voor het eerst in vier jaar niet in de Ziggo Dome, omdat het viertal werkt aan nieuw materiaal. Vandaar dat er iets anders wordt georganiseerd. Gitarist Casper Starreveld over deze speciale eenmalige vertoning: “Dit is onze favoriete showreeks in de Ziggo Dome geweest, en we vinden het heel tof dat we die show nu op het grootste scherm kunnen gaan laten zien." Zanger Eloi Youssef vult aan: "Het is echt iets bijzonders geworden, waar we heel trots op zijn. Kensington in de bioscoop, wederom een mijlpaal!”.`
        },
        media: {
          poster: {
            small:
              "https://media.pathe.nl/thumb/180x254/gfx_content/posterhr/K_ArenA_filmposter_A4_300dpi_PATHE.NL.jpg",
            large:
              "https://media.pathe.nl/nocropthumb/1600x590/gfx_content/2 Grote Still/stillkensingtonconcert2017.jpg"
          }
        }
      }
    ];
  }
};
