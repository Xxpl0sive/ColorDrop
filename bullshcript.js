const zephiiscene = BS.BanterScene.GetInstance();

if(window.isBanter){
BS.BanterScene.GetInstance().On("unity-loaded", ()=>{
  BS.BanterScene.GetInstance().TeleportTo({x: -6, y: 0.02, z: -7}, 0, true);
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
  BS.BanterScene.GetInstance().TeleportTo({x: -6, y: 0.02, z: -7}, 0, true);
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

  const textObject = new BS.GameObject();
  const scoreText = await textObject.AddComponent(new BS.BanterText("Score: ", new BS.Vector4(1,1,1,1), 1, 0, 1));
  const transform = await textObject.AddComponent(new BS.Transform());
  transform.localPosition = new BS.Vector3(-1,-312.8,-4); transform.localScale = new BS.Vector3(3, 3, 2);
  
  const secondTextObject = new BS.GameObject();
  const SecondScoreText = await secondTextObject.AddComponent(new BS.BanterText("Score: ", new BS.Vector4(1,1,1,1), 1, 0, 1));
  const SecondTransform = await secondTextObject.AddComponent(new BS.Transform());
  SecondTransform.localPosition = new BS.Vector3(3,-312.8,-4); SecondTransform.localScale = new BS.Vector3(3, 3, 2);

  // Start Point
  makeTriggerBox(new BS.Vector3(-7.33,-9.4,-6.12), new BS.Vector3(80,1,80), new BS.Vector4(0,1,0,0), () => {
      isStarted = true; startTime = new Date().getTime();
  });
  // Finish Point
  makeTriggerBox(new BS.Vector3(-2,-308.9,-4), new BS.Vector3(90,1,90), new BS.Vector4(0,0,0,0), () => {
      if(isStarted) { isStarted = false; duration = new Date().getTime() - startTime; checkSpaceState(zephiiscene.localUser.name, duration); }
  });
  
var countervariable = 0;
    AframeInjection.addEventListener('spaceStateChange', async e => {countervariable++
      console.log(`Space State Listener.${countervariable}`); updateScoreBoardZ(); 
      e.detail.changes.forEach(change => { console.log(change);})
    });
  
  function updateScoreBoardZ() { scoreText.text = "Score: ";
    let spacestatethings = zephiiscene.spaceState.public;
    // Convert the entries to an array, sort by value, and then format the output
    let sortedEntries = Object.entries(spacestatethings).sort((a, b) => a[1] - b[1]);
    sortedEntries.forEach(([key, value]) => {
      if (!key.includes("latestjump:") && value < 999999 && value > 10000) {
        scoreText.text += "\n" + key.substring(0, 19) + ": " + value / 1000;
      } else if (key.includes("latestjump:") && value < 999999 && value > 10000) {
        const strippedKey = key.replace("latestjump:", '');
        SecondScoreText.text += "\n" + strippedKey.substring(0, 19).trim() + ": " + (value / 1000);
      }
    });              
  };
  
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
};

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
