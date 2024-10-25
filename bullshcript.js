const zephiiscene = BS.BanterScene.GetInstance();

if(window.isBanter){
BS.BanterScene.GetInstance().On("unity-loaded", ()=>{
  BS.BanterScene.GetInstance().TeleportTo({x: -6, y: -0.5, z: -7}, 0, true);
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
  zettings.SpawnPoint = new BS.Vector4(-6, 0.02, -7, 180);
  zephiiscene.SetSettings(zettings);
  setTimeout(() => { setSettingsAgain(zettings); }, 2000);
});

function setSettingsAgain(zettings) {
  BS.BanterScene.GetInstance().TeleportTo({x: -6, y: -0.5, z: -7}, 0, true);
  zettings.EnableDevTools = false; zettings.EnableTeleport = false;
  zettings.EnableForceGrab = false; zettings.EnableSpiderMan = false; zettings.EnablePortals = false;
  zettings.EnableGuests = true; zettings.EnableQuaternionPose = false; zettings.EnableControllerExtras = true;
  zettings.EnableFriendPositionJoin = false; zettings.EnableDefaultTextures = true; zettings.EnableAvatars = true;
  zettings.MaxOccupancy = 30; zettings.RefreshRate = 72; zettings.ClippingPlane = new BS.Vector2(0.02, 300);
  zettings.SpawnPoint = new BS.Vector4(-6, 0.02, -7, 180); zephiiscene.SetSettings(zettings);
};

async function zephiidrop() {
  const makeTriggerBox = async (pos, scale, color, callback) => {
      const box = new BS.GameObject();
      await box.AddComponent(new BS.BanterGeometry(BS.GeometryType.BoxGeometry));
      await box.AddComponent(new BS.BanterMaterial("Sprites/Diffuse", "", color));
      await box.AddComponent(new BS.BoxCollider(true));
      await box.AddComponent(new BS.BanterColliderEvents());
      const transform = await box.AddComponent(new BS.Transform());
      transform.localScale = scale; transform.localPosition = pos;
      box.On("trigger-enter", (e) => { if (e.detail.user !== undefined) { callback(); }});
  }   

  let startTime = -1, duration = 0, isStarted = false;

  // Start Point
  makeTriggerBox(new BS.Vector3(-7.33,-9.4,-6.12), new BS.Vector3(80,1,80), new BS.Vector4(0,1,0,0), () => {
      isStarted = true; startTime = new Date().getTime();
  });
  // Finish Point
  makeTriggerBox(new BS.Vector3(-2,-308.9,-4), new BS.Vector3(90,1,90), new BS.Vector4(0,0,0,0), () => {
      if(isStarted) { isStarted = false; duration = new Date().getTime() - startTime; checkSpaceState(zephiiscene.localUser.name.replace(/["'\\]/g, '\\$&'), duration); setPublicSpaceProp("latestjump:" + zephiiscene.localUser.name.replace(/["'\\]/g, '\\$&'), duration);}
  });
  
var countervariable = 0;
    AframeInjection.addEventListener('spaceStateChange', async e => {countervariable++
      console.log(`Space State Listener.${countervariable}`); updateScoreBoardZ(); 
      e.detail.changes.forEach(change => { console.log(change);})
    });
  
async function updateScoreBoardZ() {
  // Cleanup: Find and destroy all existing column objects
  await cleanupColumns("HighScores_");
  await cleanupColumns("LatestJumps_");

  const maxNamesPerColumn = 25; // Max entries per column

  // Separate entries into high scores and latest jumps
  const { highScoreEntries, latestJumpEntries } = getSortedEntries(zephiiscene.spaceState.public);

  // Create columns for high scores (offset along Z-axis)
  await createColumns(
    "High Scores: ",
    highScoreEntries,
    { startX: -15, startY: -309.4, startZ: 7, rotation: 1, offsetAxis: "Z", prefix: "HighScores_" },
    maxNamesPerColumn,
    7.5 // Offset value
  );

  // Create columns for latest jumps (offset along X-axis)
  await createColumns(
    "Latest Jumps: ",
    latestJumpEntries,
    { startX: 18, startY: -309.4, startZ: 0, rotation: 0, offsetAxis: "X", prefix: "LatestJumps_" },
    maxNamesPerColumn,
    7.5 // Offset value
  );
}

// Helper function to clean up columns by prefix
async function cleanupColumns(prefix) {
  let columnIndex = 0;
  while (true) {
    const columnObject = await BS.BanterScene.GetInstance().Find(`${prefix}${columnIndex}`);
    if (!columnObject) break; // Stop when no more columns are found
    columnObject.Destroy(); // Destroy the existing column object
    columnIndex++;
  }
}

// Helper function to get sorted entries
function getSortedEntries(spacestatethings) {
  let sortedEntries = Object.entries(spacestatethings).sort((a, b) => a[1] - b[1]);
  let highScoreEntries = [];
  let latestJumpEntries = [];

  sortedEntries.forEach(([key, value]) => {
    if (!key.includes("latestjump:") && value < 999999 && value > 10000) {
      highScoreEntries.push(`${key.substring(0, 19).trim()}: ${value / 1000}`);
    } else if (key.includes("latestjump:") && value < 999999 && value > 10000) {
      const strippedKey = key.replace("latestjump:", '').substring(0, 19).trim();
      latestJumpEntries.push(`${strippedKey}: ${value / 1000}`);
    }
  });

  return { highScoreEntries, latestJumpEntries };
}

// Helper function to create text columns dynamically with unique names and custom offsets
async function createColumns(
  title,
  entries,
  { startX, startY, startZ, rotation, offsetAxis, prefix },
  maxPerColumn,
  offsetValue
) {
  let currentColumn = 0;

  for (let i = 0; i < entries.length; i += maxPerColumn) {
    // Create a new text object with a unique name for each column
    const textObject = new BS.GameObject(`${prefix}${currentColumn}`);
    const scoreText = await textObject.AddComponent(new BS.BanterText(title, new BS.Vector4(1, 1, 1, 1)));

    // Add the relevant entries to the text
    let columnText = entries.slice(i, i + maxPerColumn).join("\n");
    scoreText.text += `\n${columnText}`;

    // Set the position and rotation of the column
    const transform = await textObject.AddComponent(new BS.Transform());

    // Apply offset based on the chosen axis (X or Z)
    let positionX = startX + (offsetAxis === "X" ? currentColumn * offsetValue : 0);
    let positionZ = startZ + (offsetAxis === "Z" ? currentColumn * offsetValue : 0);

    transform.localPosition = new BS.Vector3(positionX, startY, positionZ);
    transform.localRotation = new BS.Vector3(0, rotation, 0); // Apply custom rotation
    transform.localScale  = new BS.Vector3(2, 2, 1);

    currentColumn++;
  }
}

  function checkSpaceState(stateName, duration) { const spaceStates = zephiiscene.spaceState.public;
    if (!spaceStates.hasOwnProperty(stateName)) { return setPublicSpaceProp(stateName, duration); }
    const numStateValue = Number(spaceStates[stateName]); const numDuration = Number(duration);
    if (!isNaN(numStateValue) && !isNaN(numDuration) && numStateValue > numDuration) {
        console.log(`NUM ${numDuration} IS Less Than NUM ${numStateValue}`);
        return setPublicSpaceProp(stateName, duration);
    } console.log(`${stateName}'s: ${duration} Not Less Than ${numStateValue}`);
  }
  
updateScoreBoardZ();
handResetAttempt();
};

let firstdroprun = true; let waitingforunity = true;
if (waitingforunity) { const zscreeninterval = setInterval(function() {
  if (zephiiscene.unityLoaded) { waitingforunity = false; clearInterval(zscreeninterval);
    if (firstdroprun) { firstdroprun = false; zephiidrop(); }; };
}, 500); };
   // setPublicSpaceProp('Fire', '23183828');  //THIS IS WHAT YOU ENTER IN CONSOLE

async function handResetAttempt() {
    const thisintervalvar = setInterval(async () => {
      if (window.user && window.user.id !== undefined) { clearInterval(thisintervalvar);
        const handbutton = new BS.GameObject("handbutton");
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
        const textObject = new BS.GameObject(`handText`);
        await textObject.AddComponent(new BS.BanterText("Reset/Respawn", new BS.Vector4(1,1,1,1)));
        const textTransform = await textObject.AddComponent(new BS.Transform()); textTransform.localPosition = new BS.Vector3(9.4,-2.5,-0.1);
        await textObject.SetParent(handbutton, false);
        zephiiscene.LegacyAttachObject(handbutton, zephiiscene.localUser.uid, BS.LegacyAttachmentPosition.LEFT_HAND);
      } }, 100);
};

let handcontrolthingyZ = true;
zephiiscene.On("user-joined", e => { if (e.detail.isLocal && handcontrolthingyZ === false) { handcontrolthingyZ = true; handResetAttempt(); }; });
zephiiscene.On("user-left", e => { if (e.detail.isLocal) { handcontrolthingyZ = false; }; });

};
