var loaded = false;

// load Google
(function () {
    var gads = document.createElement("script");
    gads.type = "text/javascript";
    gads.src = "//securepubads.g.doubleclick.net/tag/js/gpt.js";
    gads.addEventListener("load", function () {
        if (loaded)
            return loadConsentManager();
        loaded = true;
    });
    document.head.appendChild(gads);
})();


(function () {
    const cc = document.createElement("script");
    cc.type = "text/javascript";
    cc.src = "https://cc.cdn.civiccomputing.com/9/cookieControl-9.x.min.js";
    cc.addEventListener("load", function () {
        if (loaded)
            return loadConsentManager();
        loaded = true;
    });
    document.head.appendChild(cc);
})();


var consentForAds;
var adsLoaded = false;
var limitedAds = false;
function objectValues(key) {
    return this[key];
}
function getObjectValues(object) {
    return Object.keys(object).slice(0, 10).map(objectValues, object);
}
function loadConsentManager() {
    CookieControl.load({
        apiKey: 'dcb41ff0608ffc76945bce01daf40227fda872b2',
        product: 'PRO_MULTISITE',
        toggleType: 'slider',
        logConsent: false,
        notifyOnce: true,
        initialState: 'BOX', //'NOTIFY', //'OPEN',
        position: 'LEFT',
        theme: 'DARK',
        layout: 'SLIDEOUT',
        locale: 'nl',
        iabCMP: true,
        iabConfig: {
            language: 'nl',
            publisherCC: 'NL'
        },
        closeStyle: 'label',
        consentCookieExpiry: 365,
        subDomains: true,
        rejectButton: true,
        settingsStyle: 'button',
        encodeCookie: false,
        excludedCountries: 'all',
        necessaryCookies: ['uid', 'visits', 'banner', 'deviceStats', 'favoriteZenders'],
        branding: {
            fontFamily: 'Arial,sans-serif',
            fontSizeTitle: '1.4em',
            fontSizeHeaders: '1.1em',
            fontSize: '0.94em',
            backgroundColor: '#222222',
            toggleText: '#ddd',
            toggleColor: '#666',
            toggleBackground: '#444',
            alertText: '#fff',
            alertBackground: '#111111',
            acceptText: '#ffffff',
            acceptBackground: '#ed6658',
            buttonIcon: null,
            buttonIconWidth: '64px',
            buttonIconHeight: '64px',
            removeAbout: true
        },
        accessibility: {
            accessKey: 'C',
            highlightFocus: false
        },
        text: {
            iabCMP: {
                panelTitle: 'Deze site gebruikt cookies om informatie op uw computer op te slaan',
                panelIntro1: 'Wij en geselecteerde bedrijven gebruiken cookies om informatie op te slaan en op te halen uit uw browser. Deze informatie kan over u, uw voorkeuren of uw apparaat gaan en wordt meestal gebruikt om de site te laten werken zoals u verwacht. Hoewel de informatie u gewoonlijk niet rechtstreeks identificeert, kunnen details zoals het apparaat, het besturingssysteem en het type browser als persoonlijke gegevens worden beschouwd, omdat dit helpt om een persoonlijkere web ervaring te creëren. U kunt bekijken hoe deze informatie wordt gebruikt en uw toestemmingsvoorkeuren voor cookies of voor andere identificerende technologie hieronder aanpassen.',
                panelIntro2: 'U kunt uw voorkeuren op elk moment vrijelijk wijzigen door linksonder op de site op het pictogram "C" van Cookiebeheer te klikken. ',
                panelIntro3: 'Radioportal Radio.NL is een kosteloze site/dienst. Om deze deze dienst ook in de toekomst te kunnen blijven bieden, zijn de inkomsten uit reclame (banners) voor ons erg belangrijk. We hopen dat U dit meeneemt in uw keuze.',
                acceptAll: 'Accepteer alles',
                dataUse: 'Selecteer op doel',
                vendors: 'Selecteer op bedrijf',
                purposes: 'Doel',
                specialPurposes: 'Speciaal doel',
                features: 'Kenmerk',
                specialFeatures: 'Speciaal kenmerk',
                savePreferences: 'Sla instellingen op en sluit af !',
                iabName: 'IAB Transparency and Consent Framework (TCF).',
                aboutIab: 'De bovengenoemde gepersonaliseerde advertentieservices voldoen aan het',
                rejectAll: 'Alles afwijzen'
            },
        },
        statement: {
            description: 'Je vindt meer informatie in onze ',
            name: 'privacy- en cookieverklaring',
            url: 'https://www.radio.nl/cookies.php',
            updated: '08/09/2020'
        }
    });
    (function makeStub() {
        tracingBenchmark("[makeStub]");
        var tcfQueue = [];
        if (typeof window.top.frames.__tcfapiLocator === "undefined") {
            function tcfapiQueuer() {
                tracingBenchmark("[makeStub, tcfapiQueuer]");
                tcfQueue.push({ self: this, args: arguments });
            }
            window.top.__tcfapi = tcfapiQueuer;
            (function tcfInterval() {
                if (typeof window.top.frames.__tcfapiLocator !== "undefined" && __tcfapi !== tcfapiQueuer) {
                    tcfQueue.forEach(function (context) {
                        __tcfapi.apply(context.self, context.args);
                    });
                }
                else {
                    setTimeout(tcfInterval, 5);
                }
            })();
            // // this eventListener does not always work and therefore i am implementing tcfInterval
            // window.top.addEventListener("message", function messageHandler(event) {
            //     tracingBenchmark("[makeStub, event message]");
            //     if (typeof window.top.frames.__tcfapiLocator !== "undefined" && __tcfapi !== tcfapiQueuer) {
            //         window.top.removeEventListener("message", messageHandler, false);
            //         tcfQueue.forEach(function (context) {
            //             __tcfapi.apply(context.self, context.args);
            //         });
            //     }
            // }, false); 
        }
    })();
    console.log("loaded");
    __tcfapi("addEventListener", 2, function (tcData, success) {
        if (tcData.eventStatus === "useractioncomplete" || tcData.eventStatus === "tcloaded") {
            if (!limitedAds) {
                try {
                    __tcfapi('getTCData', 2, function (tcData, success) {
                        if (success && (tcData.eventStatus == "useractioncomplete" || tcData.eventStatus === 'tcloaded') && tcData.vendor.consents["755"] === false)
                            limitedAds = true;
                    }, [755]);
                } catch (e) { }
            }
            var newConsentForAds = true;
            const consents = getObjectValues(tcData.purpose.consents);
            console.log("consents", tcData.purpose.consents)
            console.log(tcData.eventStatus, consents);
            newConsentForAds = consents.length > 0
                ? consents.indexOf(false) === -1
                : false;
            console.log("newConsentForAds = " + newConsentForAds);
            if (consentForAds !== newConsentForAds) {
                consentForAds = newConsentForAds;
                if (adsLoaded) return;
                adsLoaded = true;
            }
        }
    });
    gtag('config', 'UA-2192704-74', { 'anonymize_ip': true });
}
