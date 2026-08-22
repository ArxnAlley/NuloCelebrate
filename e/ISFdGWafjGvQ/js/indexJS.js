/* ============================================================
   PARTY CONFIGURATION

   The one block to edit when connecting the backend. Event
   details are mirrored from googleAppsScript/Config.gs — keep the
   two in step so the calendar file and the reminder emails
   describe the same party.
============================================================ */

const birthdayConfig = {

    /* The deployed Google Apps Script Web App URL. Redeploying as a
       new version of the same deployment keeps this URL unchanged. */

    appsScriptUrl: 'https://script.google.com/macros/s/AKfycbw0FTHKfbHJBjRkZjg3bZH1dcVLWUnMC0ase55uoThuLWlqtbek7APZ2zfuz4fXd0VB/exec',

    event: {

        name: "Lylah's 3rd Luau",

        /* Local date and 24-hour times of the party. */

        date: '2026-09-27',

        startTime: '16:00',

        endTime: '19:00',

        /* Offset of the event's time zone on the event date.
           Ohio in late September is EDT, UTC-4. Written into the
           calendar file as real UTC instants, which Apple
           Calendar, Google Calendar, and Outlook all read the
           same way without needing a timezone definition. */

        utcOffsetHours: -4,

        address: '7492 Spilker Rd, Lynchburg, OH 45142',

        url: 'https://celebrate.nulostudio.com/e/ISFdGWafjGvQ/',

        description: "Join us for Lylah's 3rd Luau! Come hungry — "
            + "we'll have plenty of food waiting for you."

    }

};


/* ============================================================
   CONSTANTS & SELECTORS
============================================================ */

const pageBody = document.body;

const siteIdentity = document.querySelector('.siteIdentity');

const invitationSection = document.querySelector('.invitationSection');

const invitationEnvelope = document.querySelector('[data-invitation-envelope]');

const invitationHint = document.querySelector('[data-invitation-hint]');

const liloPresenter = document.querySelector('[data-lilo-presenter]');

const revealItems = document.querySelectorAll('.revealItem');

const journeySection = document.querySelector('.journeySection');

const journeySticky = document.querySelector('.journeySticky');

const flightMap = document.querySelector('.flightMap');

const flightPath = document.querySelector('[data-flight-path]');

const flightPathShadow = document.querySelector('.flightPathShadow');

const explorerVehicle = document.querySelector('[data-explorer-vehicle]');

const journeyStops = Array.from(document.querySelectorAll('[data-journey-stop]'));

const journeyProgressFill = document.querySelector('[data-progress-fill]');

const rsvpModal = document.querySelector('[data-rsvp-modal]');

const openRsvpButtons = document.querySelectorAll('[data-open-rsvp]');

const closeRsvpButton = document.querySelector('[data-close-rsvp]');

const floatingRsvp = document.querySelector('[data-floating-rsvp]');

const siteFooter = document.querySelector('.siteFooter');

const rsvpForm = document.querySelector('[data-rsvp-form]');

const rsvpSuccess = document.querySelector('[data-rsvp-success]');

const successHeading = document.querySelector('[data-success-heading]');

const successMessage = document.querySelector('[data-success-message]');

const editRsvpButton = document.querySelector('[data-edit-rsvp]');

const guestCountFields = document.querySelector('[data-guest-count-fields]');

const attendanceInputs = document.querySelectorAll('input[name="attendance"]');

const submitLabel = document.querySelector('[data-submit-label]');

const formNote = document.querySelector('[data-form-note]');

const successActions = document.querySelector('[data-success-actions]');

const appleCalendarButton = document.querySelector('[data-calendar-apple]');

const googleCalendarLink = document.querySelector('[data-calendar-google]');

const outlookCalendarLink = document.querySelector('[data-calendar-outlook]');

const downloadCalendarButton = document.querySelector('[data-calendar-download]');

const getDirectionsLink = document.querySelector('[data-get-directions]');

const backToPartyButton = document.querySelector('[data-back-to-party]');

const reminderPrompt = document.querySelector('[data-reminder-prompt]');

const reminderOffer = document.querySelector('[data-reminder-offer]');

const reminderSuccess = document.querySelector('[data-reminder-success]');

const reminderForm = document.querySelector('[data-reminder-form]');

const reminderEmailInput = document.querySelector('#reminderEmail');

const reminderSubmitButton = document.querySelector('[data-reminder-submit]');

const reminderStatus = document.querySelector('[data-reminder-status]');

const storedRsvpKey = 'lylahLuauRsvpId';

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

const mobileLayoutPreference = window.matchMedia('(max-width: 47.98rem)');

const confettiColors = ['#f36f67', '#ffd85b', '#16abc0', '#176b58', '#ff9a58', '#ffffff'];

const desktopFlightPath = 'M 18 13 C 82 10, 84 25, 48 28 C 14 31, 13 40, 56 42 C 92 44, 88 54, 48 56 C 14 58, 13 69, 56 71 C 92 73, 88 86, 82 89';

const mobileFlightPath = 'M 20 13 C 76 10, 79 25, 52 28 C 25 31, 20 39, 50 42 C 78 44, 76 54, 52 56 C 24 58, 20 69, 50 71 C 80 74, 78 86, 60 89';

let activeRsvpTrigger = null;

let scrollFrameRequested = false;

let currentRsvpId = '';

let hasOptedIntoReminders = false;

let isSubmittingRsvp = false;

let calendarObjectUrl = '';



/* ============================================================
   UTILITIES
============================================================ */

function clampNumber(value, minimum, maximum)
{

    return Math.min(Math.max(value, minimum), maximum);

}

function getJourneyProgress()
{

    if (!journeySection)
    {

        return 0;

    }

    const sectionBounds = journeySection.getBoundingClientRect();

    const scrollableDistance = Math.max(sectionBounds.height - window.innerHeight, 1);

    return clampNumber(-sectionBounds.top / scrollableDistance, 0, 1);

}

function getInvitationProgress()
{

    if (!invitationSection)
    {

        return 0;

    }

    const invitationBounds = invitationSection.getBoundingClientRect();

    const progressDistance = window.innerHeight + (invitationBounds.height * 0.52);

    return clampNumber((window.innerHeight - invitationBounds.top) / progressDistance, 0, 1);

}



/* ============================================================
   PAGE ENTRANCE & REVEALS
============================================================ */

function revealPage()
{

    window.requestAnimationFrame(
        () =>
        {

            pageBody.classList.add('isLoaded');

            window.setTimeout(
                () =>
                {

                    siteIdentity?.classList.add('isVisible');

                },
                motionPreference.matches ? 0 : 450
            );

        }
    );

}

function revealAllStaticItems()
{

    revealItems.forEach(
        (item) =>
        {

            item.classList.add('isVisible');

        }
    );

    invitationEnvelope?.classList.add('isRevealed');

    invitationHint?.classList.add('isVisible');

}

function revealInvitation()
{

    invitationEnvelope?.classList.add('isRevealed');

    invitationHint?.classList.add('isVisible');

}

function initializeRevealObserver()
{

    if (!('IntersectionObserver' in window) || motionPreference.matches)
    {

        revealAllStaticItems();

        return;

    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) =>
        {

            entries.forEach(
                (entry) =>
                {

                    if (!entry.isIntersecting)
                    {

                        return;

                    }

                    entry.target.classList.add('isVisible');

                    observer.unobserve(entry.target);

                }
            );

        },
        {

            rootMargin: '0px 0px -12% 0px',

            threshold: 0.16

        }
    );

    revealItems.forEach(
        (item) =>
        {

            revealObserver.observe(item);

        }
    );

    if (!invitationEnvelope)
    {

        return;

    }

    const invitationObserver = new IntersectionObserver(
        (entries, observer) =>
        {

            if (!entries[0].isIntersecting)
            {

                return;

            }

            if (mobileLayoutPreference.matches)
            {

                return;

            }

            revealInvitation();

            observer.disconnect();

        },
        {

            rootMargin: '0px 0px -18% 0px',

            threshold: 0.34

        }
    );

    invitationObserver.observe(invitationEnvelope);

}



/* ============================================================
   INVITATION STORY
============================================================ */

function updateLiloPresentation(progress)
{

    if (!liloPresenter)
    {

        return;

    }

    if (motionPreference.matches)
    {

        liloPresenter.style.setProperty('--liloOpacity', '1');

        liloPresenter.style.setProperty('--liloShiftX', '0rem');

        liloPresenter.style.setProperty('--liloShiftY', '0rem');

        liloPresenter.style.setProperty('--liloRotation', '-2deg');

        return;

    }

    const presentationProgress = clampNumber((progress - 0.03) / 0.48, 0, 1);

    const liloOpacity = 0.12 + (presentationProgress * 0.88);

    const horizontalShift = (1 - presentationProgress) * 2.8;

    const verticalShift = (1 - presentationProgress) * 1.2;

    const liloRotation = 9 - (presentationProgress * 11);

    liloPresenter.style.setProperty('--liloOpacity', liloOpacity.toFixed(3));

    liloPresenter.style.setProperty('--liloShiftX', `${horizontalShift.toFixed(2)}rem`);

    liloPresenter.style.setProperty('--liloShiftY', `${verticalShift.toFixed(2)}rem`);

    liloPresenter.style.setProperty('--liloRotation', `${liloRotation.toFixed(2)}deg`);

}

function updateMobileInvitationReveal()
{

    if (!mobileLayoutPreference.matches || motionPreference.matches || !invitationEnvelope || invitationEnvelope.classList.contains('isRevealed'))
    {

        return;

    }

    const closedEnvelope = invitationEnvelope.querySelector('.envelopeBack');

    if (!closedEnvelope)
    {

        return;

    }

    const closedEnvelopeBounds = closedEnvelope.getBoundingClientRect();

    const remainingEnvelopeRatio = 0.075;

    const revealScroll = window.scrollY + closedEnvelopeBounds.bottom - (window.innerHeight + (closedEnvelopeBounds.height * remainingEnvelopeRatio));

    if (window.scrollY >= revealScroll)
    {

        revealInvitation();

    }

}

function updateFloatingRsvp()
{

    if (!floatingRsvp || !invitationSection)
    {

        return;

    }

    const invitationBounds = invitationSection.getBoundingClientRect();

    const isPastInvitation = invitationBounds.bottom < window.innerHeight * 0.72;

    const footerBounds = siteFooter?.getBoundingClientRect();

    const isFooterVisible = footerBounds
        ? footerBounds.top < window.innerHeight && footerBounds.bottom > 0
        : false;

    const shouldShowButton = isPastInvitation && !isFooterVisible && !rsvpModal?.open;

    floatingRsvp.classList.toggle('isVisible', shouldShowButton);

}

function updateInvitationStory()
{

    updateMobileInvitationReveal();

    updateLiloPresentation(getInvitationProgress());

    updateFloatingRsvp();

}



/* ============================================================
   SCROLL-CONTROLLED FLIGHT
============================================================ */

function updateFlightPathForViewport()
{

    const activeFlightPath = mobileLayoutPreference.matches ? mobileFlightPath : desktopFlightPath;

    flightPath?.setAttribute('d', activeFlightPath);

    flightPathShadow?.setAttribute('d', activeFlightPath);

}

function updateJourneyStops(progress)
{

    let activeStopIndex = -1;

    journeyStops.forEach(
        (journeyStop, stopIndex) =>
        {

            const stopProgress = Number(journeyStop.dataset.stopProgress);

            if (progress >= stopProgress - 0.075)
            {

                activeStopIndex = stopIndex;

            }

        }
    );

    journeyStops.forEach(
        (journeyStop, stopIndex) =>
        {

            const isRevealed = motionPreference.matches || stopIndex <= activeStopIndex;

            const isActive = !motionPreference.matches && stopIndex === activeStopIndex;

            journeyStop.classList.toggle('isRevealed', isRevealed);

            journeyStop.classList.toggle('isActive', isActive);

        }
    );

}

function updateExplorerPosition(progress)
{

    if (!flightPath || !flightMap || !journeySticky || !explorerVehicle)
    {

        return;

    }

    const pathLength = flightPath.getTotalLength();

    const pathProgress = clampNumber((progress - 0.01) / 0.98, 0, 1);

    const currentDistance = pathProgress * pathLength;

    const nearbyDistance = clampNumber(currentDistance + 0.75, 0, pathLength);

    const currentPoint = flightPath.getPointAtLength(currentDistance);

    const nearbyPoint = flightPath.getPointAtLength(nearbyDistance);

    const mapBounds = flightMap.getBoundingClientRect();

    const stageBounds = journeySticky.getBoundingClientRect();

    const viewBox = flightMap.viewBox.baseVal;

    const xScale = mapBounds.width / viewBox.width;

    const yScale = mapBounds.height / viewBox.height;

    const explorerX = mapBounds.left - stageBounds.left + ((currentPoint.x - viewBox.x) * xScale);

    const explorerY = mapBounds.top - stageBounds.top + ((currentPoint.y - viewBox.y) * yScale);

    const tangentX = (nearbyPoint.x - currentPoint.x) * xScale;

    const tangentY = (nearbyPoint.y - currentPoint.y) * yScale;

    const isFacingLeft = tangentX < 0;

    let explorerRotation = Math.atan2(tangentY, tangentX) * (180 / Math.PI);

    if (explorerRotation > 90)
    {

        explorerRotation -= 180;

    }

    if (explorerRotation < -90)
    {

        explorerRotation += 180;

    }

    explorerRotation = clampNumber(explorerRotation, -18, 18);

    explorerVehicle.style.setProperty('--explorerX', `${explorerX}px`);

    explorerVehicle.style.setProperty('--explorerY', `${explorerY}px`);

    explorerVehicle.style.setProperty('--explorerRotation', `${explorerRotation.toFixed(2)}deg`);

    explorerVehicle.style.setProperty('--explorerFacing', isFacingLeft ? '-1' : '1');

}

function updateScrollScene()
{

    scrollFrameRequested = false;

    const journeyProgress = getJourneyProgress();

    journeySticky?.classList.toggle('hasJourneyStarted', journeyProgress > 0.045);

    journeySticky?.style.setProperty('--journeyProgress', journeyProgress.toFixed(4));

    journeyProgressFill?.style.setProperty('transform', `scaleX(${journeyProgress.toFixed(4)})`);

    updateInvitationStory();

    updateExplorerPosition(journeyProgress);

    updateJourneyStops(journeyProgress);

}

function requestScrollSceneUpdate()
{

    if (scrollFrameRequested)
    {

        return;

    }

    scrollFrameRequested = true;

    window.requestAnimationFrame(updateScrollScene);

}



/* ============================================================
   RSVP DIALOG
============================================================ */

function openRsvpModal(event)
{

    if (!rsvpModal || rsvpModal.open)
    {

        return;

    }

    activeRsvpTrigger = event?.currentTarget ?? document.activeElement;

    rsvpModal.showModal();

    pageBody.classList.add('hasOpenModal');

    floatingRsvp?.classList.remove('isVisible');

    window.requestAnimationFrame(
        () =>
        {

            closeRsvpButton?.focus();

        }
    );

}

function closeRsvpModal()
{

    if (!rsvpModal?.open)
    {

        return;

    }

    rsvpModal.close();

}

function finalizeRsvpClose()
{

    pageBody.classList.remove('hasOpenModal');

    updateFloatingRsvp();

    activeRsvpTrigger?.focus?.();

    activeRsvpTrigger = null;

}

function closeRsvpFromBackdrop(event)
{

    if (event.target === rsvpModal)
    {

        closeRsvpModal();

    }

}

function initializeRsvpModal()
{

    openRsvpButtons.forEach(
        (openRsvpButton) =>
        {

            openRsvpButton.addEventListener('click', openRsvpModal);

        }
    );

    closeRsvpButton?.addEventListener('click', closeRsvpModal);

    rsvpModal?.addEventListener('click', closeRsvpFromBackdrop);

    rsvpModal?.addEventListener('close', finalizeRsvpClose);

}



/* ============================================================
   RSVP FORM
============================================================ */

function updateAttendanceFields()
{

    const selectedAttendance = document.querySelector('input[name="attendance"]:checked')?.value;

    const isAttending = selectedAttendance === 'yes';

    guestCountFields?.classList.toggle('isHidden', !isAttending);

    guestCountFields?.setAttribute('aria-hidden', String(!isAttending));

    if (submitLabel)
    {

        submitLabel.textContent = isAttending ? 'Count our ohana in!' : 'Send our aloha';

    }

}

function updateNumberStepper(event)
{

    const stepButton = event.target.closest('[data-step]');

    if (!stepButton)
    {

        return;

    }

    const numberStepper = stepButton.closest('[data-number-stepper]');

    const numberInput = numberStepper?.querySelector('input[type="number"]');

    if (!numberInput)
    {

        return;

    }

    const stepAmount = Number(stepButton.dataset.step);

    const minimumValue = Number(numberInput.min || 0);

    const maximumValue = Number(numberInput.max || 99);

    const nextValue = clampNumber(Number(numberInput.value || 0) + stepAmount, minimumValue, maximumValue);

    numberInput.value = String(nextValue);

    numberInput.dispatchEvent(new Event('change', { bubbles: true }));

}

function createConfettiBurst()
{

    if (motionPreference.matches)
    {

        return;

    }

    for (let pieceIndex = 0; pieceIndex < 34; pieceIndex += 1)
    {

        const confettiPiece = document.createElement('span');

        const angle = (Math.PI * 2 * pieceIndex) / 34;

        const distance = 110 + (Math.random() * 230);

        const horizontalDistance = Math.cos(angle) * distance;

        const verticalDistance = (Math.sin(angle) * distance) + 150;

        confettiPiece.className = 'confettiPiece';

        confettiPiece.style.setProperty('--confettiColor', confettiColors[pieceIndex % confettiColors.length]);

        confettiPiece.style.setProperty('--confettiX', `${horizontalDistance.toFixed(0)}px`);

        confettiPiece.style.setProperty('--confettiY', `${verticalDistance.toFixed(0)}px`);

        confettiPiece.style.setProperty('--confettiRotation', `${360 + (Math.random() * 720)}deg`);

        confettiPiece.style.animationDelay = `${Math.random() * 100}ms`;

        document.body.append(confettiPiece);

        window.setTimeout(
            () =>
            {

                confettiPiece.remove();

            },
            1500
        );

    }

}

/* ============================================================
   RSVP TRANSPORT
============================================================ */

function isBackendConnected()
{

    return Boolean(birthdayConfig.appsScriptUrl)
        && birthdayConfig.appsScriptUrl.indexOf('PASTE_') === -1;

}

/* The RSVP ID lets a returning guest edit their answer instead of
   creating a second row. Private-mode browsers throw on storage
   access, and a lost ID only costs a duplicate row, so failures
   here are never surfaced. */

function readStoredRsvpId()
{

    try
    {

        return window.localStorage.getItem(storedRsvpKey) || '';

    }
    catch (storageError)
    {

        return '';

    }

}

function writeStoredRsvpId(rsvpId)
{

    try
    {

        window.localStorage.setItem(storedRsvpKey, rsvpId);

    }
    catch (storageError)
    {

        /* Nothing to do — the next submission simply creates a row. */

    }

}

/* Sent as text/plain so the browser treats it as a simple request.
   Apps Script cannot answer a CORS preflight, so an application/json
   content type would fail before the request ever arrived. */

async function postToAppsScript(payload)
{

    const response = await fetch(
        birthdayConfig.appsScriptUrl,
        {

            method: 'POST',

            headers: { 'Content-Type': 'text/plain;charset=utf-8' },

            body: JSON.stringify(payload),

            redirect: 'follow'

        }
    );

    if (!response.ok)
    {

        throw new Error(`Request failed with status ${response.status}`);

    }

    return response.json();

}

function setFormNote(message, isError)
{

    if (!formNote)
    {

        return;

    }

    formNote.textContent = message;

    formNote.classList.toggle('hasError', Boolean(isError));

}


/* ============================================================
   CALENDAR FILE
============================================================ */

/* Resolves the configured local time to a real instant. Every
   calendar target is built from this one value, so the web links
   and the downloaded file can never disagree about when the party
   starts. */

function buildEventInstant(dateText, timeText)
{

    const [year, month, day] = dateText.split('-').map(Number);

    const [hour, minute] = timeText.split(':').map(Number);

    return new Date(Date.UTC(
        year,
        month - 1,
        day,
        hour - birthdayConfig.event.utcOffsetHours,
        minute,
        0
    ));

}

/* Converts the configured local time into a UTC stamp. Writing
   real instants keeps every calendar app in agreement without a
   VTIMEZONE block. */

function buildCalendarStamp(dateText, timeText)
{

    return formatCalendarStamp(buildEventInstant(dateText, timeText));

}

function formatCalendarStamp(dateValue)
{

    const pad = (value) => String(value).padStart(2, '0');

    return dateValue.getUTCFullYear()
        + pad(dateValue.getUTCMonth() + 1)
        + pad(dateValue.getUTCDate())
        + 'T'
        + pad(dateValue.getUTCHours())
        + pad(dateValue.getUTCMinutes())
        + pad(dateValue.getUTCSeconds())
        + 'Z';

}

/* Commas, semicolons, and backslashes carry meaning in an iCalendar
   TEXT value and have to be escaped or the line is misread. */

function escapeCalendarText(value)
{

    return String(value)
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\r?\n/g, '\\n');

}

/* The spec caps a line at 75 octets; longer ones continue on the
   next line prefixed with a single space. Outlook is the strictest
   about this. */

function foldCalendarLine(line)
{

    if (line.length <= 73)
    {

        return line;

    }

    const segments = [line.slice(0, 73)];

    let remainder = line.slice(73);

    while (remainder.length > 72)
    {

        segments.push(' ' + remainder.slice(0, 72));

        remainder = remainder.slice(72);

    }

    segments.push(' ' + remainder);

    return segments.join('\r\n');

}

function buildCalendarFile()
{

    const partyEvent = birthdayConfig.event;

    const lines = [

        'BEGIN:VCALENDAR',

        'VERSION:2.0',

        'PRODID:-//Nulo Studio//Birthday Invitation//EN',

        'CALSCALE:GREGORIAN',

        'METHOD:PUBLISH',

        'BEGIN:VEVENT',

        /* Stable UID: adding the event twice updates the same entry
           rather than leaving a duplicate in the calendar. */

        'UID:lylah-3rd-luau-ISFdGWafjGvQ@celebrate.nulostudio.com',

        'DTSTAMP:' + formatCalendarStamp(new Date()),

        'DTSTART:' + buildCalendarStamp(partyEvent.date, partyEvent.startTime),

        'DTEND:' + buildCalendarStamp(partyEvent.date, partyEvent.endTime),

        'SUMMARY:' + escapeCalendarText(partyEvent.name),

        'DESCRIPTION:' + escapeCalendarText(
            partyEvent.description + '\n\nInvitation: ' + partyEvent.url
        ),

        'LOCATION:' + escapeCalendarText(partyEvent.address),

        'URL:' + partyEvent.url,

        'STATUS:CONFIRMED',

        'TRANSP:OPAQUE',

        /* A day-ahead nudge inside the calendar itself, for guests
           who never opt into email. */

        'BEGIN:VALARM',

        'TRIGGER:-P1D',

        'ACTION:DISPLAY',

        'DESCRIPTION:' + escapeCalendarText(partyEvent.name + ' is tomorrow!'),

        'END:VALARM',

        'END:VEVENT',

        'END:VCALENDAR'

    ];

    return lines.map(foldCalendarLine).join('\r\n') + '\r\n';

}

function downloadCalendarFile()
{

    const calendarBlob = new Blob(
        [buildCalendarFile()],
        { type: 'text/calendar;charset=utf-8' }
    );

    if (calendarObjectUrl)
    {

        URL.revokeObjectURL(calendarObjectUrl);

    }

    calendarObjectUrl = URL.createObjectURL(calendarBlob);

    const downloadLink = document.createElement('a');

    downloadLink.href = calendarObjectUrl;

    downloadLink.download = 'lylahs-3rd-luau.ics';

    document.body.append(downloadLink);

    downloadLink.click();

    downloadLink.remove();

}

/* iPadOS 13 and later report themselves as a Mac, so the user agent
   alone cannot tell an iPad from a desktop. Touch points settle it:
   no desktop Mac reports any, and every iPad reports several. */

function isAppleMobileDevice()
{

    const userAgent = navigator.userAgent || '';

    if (/iPhone|iPad|iPod/i.test(userAgent))
    {

        return true;

    }

    return /Macintosh/i.test(userAgent) && Number(navigator.maxTouchPoints) > 0;

}

/* Apple Maps is the one mapping app an iPhone is guaranteed to have,
   and iOS hands a maps.apple.com link straight to it — so a guest
   without Google Maps installed still gets turn-by-turn directions
   rather than a prompt to install something.

   Everywhere else the universal Google Maps URL is already right: it
   opens the app on Android and the web map on desktop, including on
   a desktop Mac. */

function buildDirectionsUrl()
{

    const destination = encodeURIComponent(birthdayConfig.event.address);

    if (isAppleMobileDevice())
    {

        return 'https://maps.apple.com/?daddr=' + destination + '&dirflg=d';

    }

    return 'https://www.google.com/maps/dir/?api=1&destination=' + destination;

}


/* ============================================================
   SMART DIRECTIONS ROUTE

   A reminder email cannot tell whether it is being read on an
   iPhone, an Android phone, or a desktop, so its Get Directions
   button points back at this page with ?directions=1 rather than
   at one mapping provider. The page then makes the same platform
   choice buildDirectionsUrl() already makes for the on-site
   button, and the guest is never asked to pick a map app.

   The parameter is cleared from the address bar before the
   hand-off, so a reload — or coming Back from the map — lands on
   the ordinary invitation instead of routing a second time.

   Without the parameter nothing here runs at all.
============================================================ */

const directionsRequestParameter = 'directions';

function isDirectionsRequest()
{

    const requestedValue = new URLSearchParams(window.location.search)
        .get(directionsRequestParameter);

    if (requestedValue === null)
    {

        return false;

    }

    /* An explicit off value is honoured so the parameter can ride
       along on a link without triggering the hand-off. */

    const normalizedValue = requestedValue.trim().toLowerCase();

    return normalizedValue !== '0' && normalizedValue !== 'false';

}

/* Reports whether the address bar is now free of the parameter. */

function clearDirectionsRequestFromUrl()
{

    if (!window.history?.replaceState)
    {

        return false;

    }

    const currentUrl = new URL(window.location.href);

    currentUrl.searchParams.delete(directionsRequestParameter);

    try
    {

        window.history.replaceState(window.history.state, '', currentUrl);

    }
    catch (historyError)
    {

        return false;

    }

    return true;

}

function initializeSmartDirections()
{

    if (!isDirectionsRequest())
    {

        return;

    }

    /* Cleared before the hand-off, never after: once navigation
       starts there is no guarantee a later line runs.

       A parameter that cannot be cleared abandons the hand-off
       instead of risking it — it would otherwise fire again on
       every reload and every press of Back, which is the one
       failure mode worth being strict about. */

    if (!clearDirectionsRequestFromUrl())
    {

        return;

    }

    try
    {

        window.location.href = buildDirectionsUrl();

    }
    catch (directionsError)
    {

        /* A hand-off the browser refuses leaves the invitation
           loaded and whole — the address is on the page and the
           Get Directions button still works — which is a usable
           outcome rather than a dead end. */

    }

}


/* ============================================================
   CALENDAR HAND-OFFS

   A downloaded .ics is the only option Apple Calendar accepts, but
   it is a poor fit for someone whose calendar lives in a browser
   tab — on Windows the file tends to open in whatever app claims
   the extension, which is often not the calendar they actually
   use. Google and Outlook are handed a pre-filled event instead,
   so the guest confirms rather than hunts for a download.

   All three read the same event details as the .ics.
============================================================ */

/* Google reads a UTC range in basic ISO form. */

function buildGoogleCalendarUrl()
{

    const partyEvent = birthdayConfig.event;

    const startStamp = buildCalendarStamp(partyEvent.date, partyEvent.startTime);

    const endStamp = buildCalendarStamp(partyEvent.date, partyEvent.endTime);

    const parameters = [

        'action=TEMPLATE',

        'text=' + encodeURIComponent(partyEvent.name),

        'dates=' + startStamp + '/' + endStamp,

        'details=' + encodeURIComponent(
            partyEvent.description + '\n\nInvitation: ' + partyEvent.url
        ),

        'location=' + encodeURIComponent(partyEvent.address)

    ];

    return 'https://calendar.google.com/calendar/render?' + parameters.join('&');

}

/* Outlook expects extended ISO instants. outlook.live.com is the
   personal calendar, which is what family guests will have. */

function buildOutlookCalendarUrl()
{

    const partyEvent = birthdayConfig.event;

    const startInstant = buildEventInstant(partyEvent.date, partyEvent.startTime);

    const endInstant = buildEventInstant(partyEvent.date, partyEvent.endTime);

    const parameters = [

        'path=' + encodeURIComponent('/calendar/action/compose'),

        'rru=addevent',

        'subject=' + encodeURIComponent(partyEvent.name),

        'startdt=' + encodeURIComponent(startInstant.toISOString()),

        'enddt=' + encodeURIComponent(endInstant.toISOString()),

        'location=' + encodeURIComponent(partyEvent.address),

        'body=' + encodeURIComponent(
            partyEvent.description + '\n\nInvitation: ' + partyEvent.url
        )

    ];

    return 'https://outlook.live.com/calendar/0/deeplink/compose?' + parameters.join('&');

}


/* ============================================================
   RSVP SUBMISSION
============================================================ */

function showRsvpSuccess(guestName, isAttending)
{

    const firstName = guestName.trim().split(' ')[0] || 'friend';

    if (successHeading)
    {

        successHeading.textContent = isAttending
            ? "You're on the guest list!"
            : `${firstName}, we're sending aloha back.`;

    }

    if (successMessage)
    {

        successMessage.textContent = isAttending
            ? "We can't wait to celebrate with you."
            : "We'll miss you at the luau and save you a birthday smile.";

    }

    /* Calendar, directions, and reminders belong to guests who are
       actually coming. A decline is recorded and thanked, nothing
       more. */

    if (successActions)
    {

        successActions.hidden = !isAttending;

    }

    /* Declining unsubscribes the guest on the server, so changing
       back to attending must offer the sign-up again rather than
       still claim they are enrolled. */

    if (!isAttending)
    {

        hasOptedIntoReminders = false;

    }

    if (reminderPrompt)
    {

        reminderPrompt.hidden = !isAttending || !isBackendConnected();

    }

    resetReminderPrompt();

    rsvpForm.hidden = true;

    rsvpSuccess.hidden = false;

    rsvpSuccess.focus();

    if (isAttending)
    {

        createConfettiBurst();

    }

}

async function submitRsvpForm(event)
{

    event.preventDefault();

    if (isSubmittingRsvp || !rsvpForm?.reportValidity())
    {

        return;

    }

    const formData = new FormData(rsvpForm);

    const guestName = String(formData.get('guestName') || '').trim();

    const isAttending = formData.get('attendance') === 'yes';

    if (!isBackendConnected())
    {

        setFormNote('The RSVP service is not connected yet. Please try again later.', true);

        return;

    }

    isSubmittingRsvp = true;

    rsvpForm.classList.add('isSubmitting');

    setFormNote('Sending your RSVP…', false);

    try
    {

        const result = await postToAppsScript({

            rsvpId: currentRsvpId || readStoredRsvpId(),

            guestName: guestName,

            attendance: isAttending ? 'attending' : 'declined',

            adultCount: formData.get('adultCount') || 0,

            childCount: formData.get('childCount') || 0,

            guestMessage: formData.get('guestMessage') || '',

            honeypot: formData.get('honeypot') || '',

            source: 'website'

        });

        if (!result.success)
        {

            /* TEMPORARY diagnostic: prints the backend's real error,
               including the `diagnostic` field returned while
               DIAGNOSTIC_MODE is on in Config.gs. Remove once
               submissions are confirmed working. */

            console.error('[RSVP] backend rejected the submission:', result);

            const detail = Array.isArray(result.errors) && result.errors.length > 0
                ? result.errors[0]
                : result.message;

            setFormNote(detail || 'Unable to submit RSVP. Please try again.', true);

            return;

        }

        if (result.rsvpId)
        {

            currentRsvpId = result.rsvpId;

            writeStoredRsvpId(result.rsvpId);

        }

        setFormNote("We'll only use this to plan the party.", false);

        showRsvpSuccess(guestName, isAttending);

    }
    catch (submissionError)
    {

        /* TEMPORARY diagnostic — see the note above. */

        console.error('[RSVP] could not reach the endpoint:', submissionError);

        setFormNote(
            'We could not reach the RSVP service. Please check your connection and try again.',
            true
        );

    }
    finally
    {

        isSubmittingRsvp = false;

        rsvpForm.classList.remove('isSubmitting');

    }

}


/* ============================================================
   REMINDER OPT-IN
============================================================ */

/* Shows either the sign-up offer or the confirmation, never both.
   Called on every RSVP success so an edited response cannot leave
   a stale state on screen. */

function resetReminderPrompt()
{

    if (reminderOffer)
    {

        reminderOffer.hidden = hasOptedIntoReminders;

    }

    if (reminderSuccess)
    {

        reminderSuccess.hidden = !hasOptedIntoReminders;

    }

    /* Clear the in-progress or error line so it cannot resurface if
       the offer is ever shown again. */

    setReminderStatus('', false);

}

function setReminderStatus(message, isError)
{

    if (!reminderStatus)
    {

        return;

    }

    reminderStatus.textContent = message;

    reminderStatus.classList.toggle('hasError', Boolean(isError));

}

async function submitReminderOptIn(event)
{

    event.preventDefault();

    const emailAddress = String(reminderEmailInput?.value || '').trim();

    if (!emailAddress)
    {

        setReminderStatus('Add an email address first.', true);

        reminderEmailInput?.focus();

        return;

    }

    if (!reminderEmailInput.checkValidity())
    {

        setReminderStatus('Please enter a valid email address.', true);

        reminderEmailInput.focus();

        return;

    }

    const rsvpId = currentRsvpId || readStoredRsvpId();

    if (!rsvpId)
    {

        setReminderStatus('Please submit your RSVP first.', true);

        return;

    }

    reminderSubmitButton.disabled = true;

    setReminderStatus('Signing you up…', false);

    try
    {

        const result = await postToAppsScript({

            action: 'reminderOptIn',

            rsvpId: rsvpId,

            reminderEmail: emailAddress,

            honeypot: reminderForm?.querySelector('[data-honeypot]')?.value || ''

        });

        if (!result.success)
        {

            const detail = Array.isArray(result.errors) && result.errors.length > 0
                ? result.errors[0]
                : result.message;

            setReminderStatus(detail || 'Unable to set up reminders.', true);

            return;

        }

        /* The whole offer is replaced, not just the form — leaving the
           "Want us to remind you…" heading above a confirmation reads
           as though the sign-up did not take. */

        hasOptedIntoReminders = true;

        resetReminderPrompt();

    }
    catch (optInError)
    {

        setReminderStatus('We could not reach the reminder service. Please try again.', true);

    }
    finally
    {

        reminderSubmitButton.disabled = false;

    }

}

function editRsvpResponse()
{

    if (!rsvpForm || !rsvpSuccess)
    {

        return;

    }

    rsvpSuccess.hidden = true;

    rsvpForm.hidden = false;

    rsvpForm.querySelector('input, button')?.focus();

}

function initializeRsvpForm()
{

    rsvpForm?.addEventListener('click', updateNumberStepper);

    rsvpForm?.addEventListener('submit', submitRsvpForm);

    editRsvpButton?.addEventListener('click', editRsvpResponse);

    attendanceInputs.forEach(
        (attendanceInput) =>
        {

            attendanceInput.addEventListener('change', updateAttendanceFields);

        }
    );

    updateAttendanceFields();

    /* A returning guest keeps their RSVP ID so a second submission
       edits the original row instead of adding another. */

    currentRsvpId = readStoredRsvpId();

}

function initializeSuccessActions()
{

    if (getDirectionsLink)
    {

        getDirectionsLink.href = buildDirectionsUrl();

    }

    if (googleCalendarLink)
    {

        googleCalendarLink.href = buildGoogleCalendarUrl();

    }

    if (outlookCalendarLink)
    {

        outlookCalendarLink.href = buildOutlookCalendarUrl();

    }

    /* Apple Calendar has no web hand-off, so it takes the .ics — the
       same file the universal download offers. */

    appleCalendarButton?.addEventListener('click', downloadCalendarFile);

    downloadCalendarButton?.addEventListener('click', downloadCalendarFile);

    backToPartyButton?.addEventListener('click', closeRsvpModal);

    reminderForm?.addEventListener('submit', submitReminderOptIn);

}



/* ============================================================
   EVENT LISTENERS & INITIALIZATION
============================================================ */

function initializePage()
{

    updateFlightPathForViewport();

    revealPage();

    initializeRevealObserver();

    initializeRsvpModal();

    initializeRsvpForm();

    initializeSuccessActions();

    updateScrollScene();

    /* Last, so a guest arriving from a reminder email leaves
       behind a fully initialized page if the map hand-off is
       refused for any reason. */

    initializeSmartDirections();

}

window.addEventListener('scroll', requestScrollSceneUpdate, { passive: true });

window.addEventListener('resize', requestScrollSceneUpdate);

motionPreference.addEventListener?.('change', requestScrollSceneUpdate);

mobileLayoutPreference.addEventListener?.(
    'change',
    () =>
    {

        updateFlightPathForViewport();

        requestScrollSceneUpdate();

    }
);

if (document.readyState === 'complete')
{

    initializePage();

}
else
{

    window.addEventListener('load', initializePage, { once: true });

}
