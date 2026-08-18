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

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

const mobileLayoutPreference = window.matchMedia('(max-width: 47.98rem)');

const confettiColors = ['#f36f67', '#ffd85b', '#16abc0', '#176b58', '#ff9a58', '#ffffff'];

const desktopFlightPath = 'M 18 13 C 82 10, 84 27, 48 31 C 14 35, 13 48, 56 50 C 92 53, 88 66, 48 69 C 15 72, 17 87, 82 89';

const mobileFlightPath = 'M 20 13 C 75 10, 78 25, 52 31 C 25 36, 20 43, 50 50 C 78 56, 75 64, 50 69 C 23 75, 28 86, 78 89';

let activeRsvpTrigger = null;

let scrollFrameRequested = false;



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

function submitRsvpForm(event)
{

    event.preventDefault();

    if (!rsvpForm?.reportValidity())
    {

        return;

    }

    const formData = new FormData(rsvpForm);

    const guestName = String(formData.get('guestName') || 'friend').trim().split(' ')[0];

    const isAttending = formData.get('attendance') === 'yes';

    if (successHeading)
    {

        successHeading.textContent = isAttending
            ? `${guestName}, your ohana is on the list!`
            : `${guestName}, we're sending aloha back.`;

    }

    if (successMessage)
    {

        successMessage.textContent = isAttending
            ? "We can't wait to celebrate with you."
            : "We'll miss you at the luau and save you a birthday smile.";

    }

    rsvpForm.hidden = true;

    rsvpSuccess.hidden = false;

    rsvpSuccess.focus();

    if (isAttending)
    {

        createConfettiBurst();

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

    updateScrollScene();

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
