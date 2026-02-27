(function () {
    let initialized = false;

    async function initGame() {
        if (initialized) return;
        initialized = true;

        const zephiiscene = BS.BanterScene.GetInstance();

        // --- Scene Settings ---
        BS.BanterScene.GetInstance().TeleportTo({x: -6, y: 0, z: -7}, 0, true);
        console.log("setSceneSettings Loading...");
        const zettings = new BS.SceneSettings();
        zettings.EnableDevTools = false;
        zettings.EnableTeleport = false;
        zettings.EnableForceGrab = false;
        zettings.EnableSpiderMan = false;
        zettings.EnablePortals = false;
        zettings.EnableGuests = true;
        zettings.EnableQuaternionPose = false;
        zettings.EnableControllerExtras = true;
        zettings.EnableFriendPositionJoin = false;
        zettings.EnableDefaultTextures = true;
        zettings.EnableAvatars = true;
        zettings.MaxOccupancy = 30;
        zettings.RefreshRate = 72;
        zettings.ClippingPlane = new BS.Vector2(0.02, 300);
        zettings.SpawnPoint = new BS.Vector4(-6, -0.02, -7, 180);
        zephiiscene.SetSettings(zettings);
        
        setTimeout(() => { setSettingsAgain(zettings); }, 2000);

        function setSettingsAgain(zettings) {
            BS.BanterScene.GetInstance().TeleportTo({x: -6, y: 0, z: -7}, 0, true);
            zephiiscene.SetSettings(zettings);
        }

        // --- Helper for Space Props ---
        function setPublicSpaceProp(key, value) {
            zephiiscene.SetPublicSpaceProps({ [key]: value });
        }

        // --- Main Logic ---
        async function zephiidrop() {
            const makeTriggerBox = async (pos, scale, color, callback) => {
                const box = await new BS.GameObject().Async();
                await box.AddComponent(new BS.BanterGeometry(BS.GeometryType.BoxGeometry));
                await box.AddComponent(new BS.BanterMaterial("Sprites/Diffuse", "", color));
                await box.AddComponent(new BS.BoxCollider(true));
                await box.AddComponent(new BS.BanterColliderEvents());
                const transform = await box.AddComponent(new BS.Transform());
                transform.localScale = scale; transform.localPosition = pos;
                box.On("trigger-enter", (e) => {  if (e.detail.user !== undefined) { if (e.detail.user.isLocal === true) { callback(); } } });
            }

            let startTime = -1, duration = 0, isStarted = false;

            // Start Point
            makeTriggerBox(new BS.Vector3(-7.33,-9.4,-6.12), new BS.Vector3(80,1,80), new BS.Vector4(0,1,0,0), () => {
                isStarted = true; startTime = new Date().getTime();
            });
            // Finish Point
            makeTriggerBox(new BS.Vector3(-2,-308.9,-4), new BS.Vector3(90,1,90), new BS.Vector4(0,0,0,0), () => {
                if(isStarted) { 
                    isStarted = false; 
                    duration = new Date().getTime() - startTime; 
                    const userName = zephiiscene.localUser.name.replace(/<[^>]*>/g, '').replace(/["'\\]/g, '\\$&');
                    checkSpaceState(userName, duration); 
                    setPublicSpaceProp("latestjump:" + userName, duration);
                }
            });

            var countervariable = 0;
            // Replaced AframeInjection listener with BanterScene listener
            zephiiscene.On('space-state-changed', async e => {
                countervariable++;
                console.log(`Space State Listener.${countervariable}`); 
                updateScoreBoardZ();
                // e.detail.changes is available here if needed
            });

            async function updateScoreBoardZ() {
                const maxNamesPerColumn = 28; // Max entries per column

                // Separate entries into high scores and latest jumps
                // Ensure public state exists
                const publicState = zephiiscene.spaceState.public || {};
                const { highScoreEntries, latestJumpEntries } = getSortedEntries(publicState);

                // Update or create columns for high scores (offset along Z-axis)
                await createOrUpdateColumns(
                    "High Scores: ",
                    highScoreEntries,
                    { startX: -15, startY: -309.4, startZ: 7, rotation: 1, offsetAxis: "Z", prefix: "HighScores_" },
                    maxNamesPerColumn,
                    7.5 // Offset value
                );

                // Update or create columns for latest jumps (offset along X-axis)
                await createOrUpdateColumns(
                    "Latest Jumps: ",
                    latestJumpEntries,
                    { startX: 18, startY: -309.4, startZ: 0, rotation: 0, offsetAxis: "X", prefix: "LatestJumps_" },
                    maxNamesPerColumn,
                    7.2 // Offset value
                );
            }

            // Helper function to create or update text columns dynamically
            async function createOrUpdateColumns(
                title,
                entries,
                { startX, startY, startZ, rotation, offsetAxis, prefix },
                maxPerColumn,
                offsetValue
            ) {
                let currentColumn = 0;

                for (let i = 0; i < entries.length; i += maxPerColumn) {
                    const objectName = `${prefix}${currentColumn}`;

                    // Check if the text object already exists
                    let textObject = await BS.BanterScene.GetInstance().Find(objectName);
                    let scoreText;

                    if (textObject) {
                        // Update existing text object
                        scoreText = await textObject.GetComponent(BS.BanterText);
                        if (!scoreText) {
                            scoreText = await textObject.AddComponent(new BS.BanterText("", new BS.Vector4(1, 1, 1, 1)));
                        }
                    } else {
                        // Create a new text object
                        textObject = await new BS.GameObject(objectName).Async();
                        scoreText = await textObject.AddComponent(new BS.BanterText(title, new BS.Vector4(1, 1, 1, 1)));

                        // Set position and rotation for the new column
                        const transform = await textObject.AddComponent(new BS.Transform());
                        let positionX = startX + (offsetAxis === "X" ? currentColumn * offsetValue : 0);
                        let positionZ = startZ + (offsetAxis === "Z" ? currentColumn * offsetValue : 0);
                        transform.localPosition = new BS.Vector3(positionX, startY, positionZ);
                        transform.localRotation = new BS.Vector3(0, rotation, 0);
                        transform.localScale = new BS.Vector3(2, 2, 1);
                    };

                    // Safely update the text content
                    try {
                        if (scoreText) {
                            let columnText = entries.slice(i, i + maxPerColumn).join("\n");
                            scoreText.text = `${title}\n${columnText}`;  // Assign text safely
                        } else {
                            console.error(`BanterText component is not available for object: ${objectName}`);
                        }
                    } catch (error) {
                        console.error(`Error updating text for ${objectName}:`, error);
                    }

                    currentColumn++;
                };
            };

            // Helper function to get sorted entries
            function getSortedEntries(spacestatethings) {
                if (!spacestatethings) return { highScoreEntries: [], latestJumpEntries: [] };
                
                let sortedEntries = Object.entries(spacestatethings).sort((a, b) => a[1] - b[1]);
                let highScoreEntries = [];
                let latestJumpEntries = [];

                sortedEntries.forEach(([key, value]) => {
                    if (!key.includes("latestjump:") && value < 999999 && value > 10000) {
                        highScoreEntries.push(`${key.substring(0, 19).trim()}: <color=#FFFF00>${value / 1000}</color>`);
                    } else if (key.includes("latestjump:") && value < 999999 && value > 10000) {
                        const strippedKey = key.replace("latestjump:", '').substring(0, 19).trim();
                        latestJumpEntries.push(`${strippedKey}: <color=#FFFF00>${value / 1000}</color>`);
                    }
                });

                return { highScoreEntries, latestJumpEntries };
            }

            function checkSpaceState(stateName, duration) { 
                const spaceStates = zephiiscene.spaceState.public || {};
                if (!spaceStates.hasOwnProperty(stateName)) { return setPublicSpaceProp(stateName, duration); }
                const numStateValue = Number(spaceStates[stateName]); const numDuration = Number(duration);
                if (!isNaN(numStateValue) && !isNaN(numDuration) && numStateValue > numDuration) {
                    console.log(`NUM ${numDuration} IS Less Than NUM ${numStateValue}`);
                    return setPublicSpaceProp(stateName, duration);
                } console.log(`${stateName}'s: ${duration} Not Less Than ${numStateValue}`);
            }

            updateScoreBoardZ();
            handResetAttempt();
        }

        async function handResetAttempt() {
            const thisintervalvar = setInterval(async () => {
                if (zephiiscene.localUser && zephiiscene.localUser.uid !== undefined) { 
                    clearInterval(thisintervalvar);
                    const handbutton = await new BS.GameObject("handbutton").Async();
                    await handbutton.AddComponent(new BS.BanterGeometry(BS.GeometryType.PlaneGeometry));
                    let material = await handbutton.AddComponent(new BS.BanterMaterial("Sprites/Diffuse", "", new BS.Vector4(0,0.5,0,0.7)));
                    await handbutton.AddComponent(new BS.BoxCollider(true));
                    await handbutton.AddComponent(new BS.BanterColliderEvents());
                    handbutton.SetLayer(5);
                    const transform = await handbutton.AddComponent(new BS.Transform());
                    transform.localScale = new BS.Vector3(0.1,0.1,0.1);; transform.localPosition = new BS.Vector3(-0.05,0,0.020); transform.localEulerAngles = new BS.Vector3(0,90,180);
                    handbutton.On('click', () => { console.log(`CLICKED!`);
                        material.color = new BS.Vector4(0.3,0.3,0.3,1);
                        setTimeout(() => { material.color = new BS.Vector4(0,0.5,0,0.7); }, 100); BS.BanterScene.GetInstance().TeleportTo({x: -6, y: 0.02, z: -7}, 0, true);
                    });
                    const textObject = await new BS.GameObject(`handText`).Async();
                    await textObject.AddComponent(new BS.BanterText("Reset/Respawn", new BS.Vector4(1,1,1,1)));
                    const textTransform = await textObject.AddComponent(new BS.Transform()); textTransform.localPosition = new BS.Vector3(9.4,-2.5,-0.1);
                    await textObject.SetParent(handbutton, false);
                    zephiiscene.LegacyAttachObject(handbutton, zephiiscene.localUser.uid, BS.LegacyAttachmentPosition.LEFT_HAND);
                } 
            }, 100);
        }

        let handcontrolthingyZ = true;
        zephiiscene.On("user-joined", e => { if (e.detail.isLocal && handcontrolthingyZ === false) { handcontrolthingyZ = true; handResetAttempt(); }; });
        zephiiscene.On("user-left", e => { if (e.detail.isLocal) { handcontrolthingyZ = false; }; });

        // Start the drop logic
        zephiidrop();
    }

    // --- Check for BS availability ---
    if (window.BS) {
        initGame();
    } else {
        window.addEventListener("unity-loaded", initGame);
        window.addEventListener("bs-loaded", initGame);
    }
})();
